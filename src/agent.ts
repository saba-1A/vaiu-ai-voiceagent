import {
  type JobContext,
  type JobProcess,
  ServerOptions,
  cli,
  defineAgent,
  inference,
  voice,
  llm,
} from '@livekit/agents';
import * as livekit from '@livekit/agents-plugin-livekit';
import * as silero from '@livekit/agents-plugin-silero';
import { BackgroundVoiceCancellation } from '@livekit/noise-cancellation-node';
import { z } from 'zod';
import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';

dotenv.config({ path: '.env.local' });

class Assistant extends voice.Agent {
  constructor() {
    super({
      // ---CONVERSATION LOGIC ---
      instructions: `
        You are a casual, friendly restaurant host for "Vaiu Bistro".
        
        YOUR GOAL: Collect these details: [Name, Date, Time, Number of Guests, Cuisine Preference ,Special Requests].

        --- CRITICAL CONVERSATION RULES ---
        1. ASK ONE QUESTION AT A TIME. Do not ask eg for the date and time in the same sentence.
        2. DO NOT LIST what you need. Never say "I need your name, date, and time." Just ask for the specific missing item.
        3. NO REPETITIVE CONFIRMATIONS
        4. CONFIRM ONLY AT THE END TO COMPLETE BOOKING.

        --- FLOW ---
        1. Greet the user and ask for the first missing detail (usually Name).
        2. Continue asking for missing details one by one.
        3. If the user gives a date/city, use 'getWeather' tool to suggest seating.
        4. FINAL CONFIRMATION: Say "Let me confirm everything: [Recap all details in a line]. Is this correct?"
        5. If they say YES: Use "createBooking" tool. Then say "Booked! See you then." and hang up.
      `,

      tools: {
        // --- TOOL 1: Weather ---
        getWeather: llm.tool({
          description: `Get weather forecast for a location.`,
          parameters: z.object({
            location: z.string().describe('City name'),
          }),
          execute: async ({ location }) => {
            console.log(`🌤️ Checking weather for ${location}...`);
            const API_KEY = "ur-api-key"; 
            try {
              const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=metric`;
              const res = await fetch(url);
              const data = await res.json();
              if (data.cod !== 200) return "Weather unknown.";
              return `Weather in ${location}: ${data.weather[0].main}, ${data.main.temp}°C.`;
            } catch (e) { return "Weather unavailable."; }
          },
        }),

        // --- TOOL 2: Create Booking ---
        createBooking: llm.tool({
          description: `Save the booking to the database.`,
          parameters: z.object({
            customerName: z.string(),
            numberOfGuests: z.number(),
            bookingDate: z.string(),
            bookingTime: z.string(),
            cuisinePreference: z.string(),
            specialRequests: z.string().describe("Any allergies, birthdays, etc."),
            seatingPreference: z.string().describe("Indoor or Outdoor"),
            weatherInfo: z.string().describe("weather at that time"),
          }),
          execute: async (args) => {
            console.log(`💾 Saving booking for ${args.customerName}...`);
            try {
              const response = await fetch('http://localhost:5000/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(args),
              });
              
              const result = await response.json();
              console.log("✅ Booking Saved:", result);
              return "Booking successfully saved.";
            } catch (error) {
              console.error("❌ Backend Error:", error);
              return "Failed to save booking.";
            }
          },
        }),
      },
    });
  }
}

export default defineAgent({
  prewarm: async (proc: JobProcess) => {
    proc.userData.vad = await silero.VAD.load();
  },
  entry: async (ctx: JobContext) => {
    const session = new voice.AgentSession({
      stt: new inference.STT({ model: 'assemblyai/universal-streaming', language: 'en' }),
      llm: new inference.LLM({ model: 'openai/gpt-4o-mini' }), 
      tts: new inference.TTS({ model: 'cartesia/sonic-3', voice: '9626c31c-bec5-4cca-baa8-f8ba9e84c8bc' }),
      turnDetection: new livekit.turnDetector.MultilingualModel(),
      vad: ctx.proc.userData.vad! as silero.VAD,
    });

    await session.start({
      agent: new Assistant(),
      room: ctx.room,
      inputOptions: { noiseCancellation: BackgroundVoiceCancellation() },
    });
    
    await ctx.connect();
  },
});

cli.runApp(new ServerOptions({ agent: fileURLToPath(import.meta.url) }));