# 🍽️ Restaurant Booking Voice Agent

An intelligent, voice-enabled AI agent built with LiveKit that assists users in booking restaurant tables through natural conversation. The agent leverages OpenAI's GPT for natural language understanding and integrates real-time weather data to suggest optimal seating arrangements.

## ✨ Features

### Core Features
- **Voice Interaction:** Real-time speech-to-text and text-to-speech powered by LiveKit
- **Intelligent Conversation:** Natural language processing via OpenAI GPT
- **Weather Integration:** Real-time forecasts using OpenWeatherMap API
- **Smart Seating Suggestions:** Indoor/outdoor seating recommendations based on weather
- **Database Storage:** Persistent booking data stored in MongoDB
- **RESTful API:** Full CRUD operations for booking management

### Bonus Features
- **Robust Natural Language Processing:** Supports varied user input such as:
  - "I want to book a table" ✅
  - "Table for 2" ✅
- **Context-Aware Responses:** Maintains context throughout the booking conversation
- **Flexible Input Handling:** Understands multiple ways to express dates, times, and preferences

## 🛠️ Tech Stack

### Frontend
- React.js
- LiveKit React Components
- Web Audio API

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose

### AI & Voice Services
- LiveKit: Real-time voice communication framework
- OpenAI GPT API: Natural language understanding and dialogue
- OpenWeatherMap API: Real-time weather data

### Database
- MongoDB Atlas or local MongoDB

## 📦 Prerequisites

Ensure the following are installed or configured before running the project:

- Node.js (version 16 or above)
- MongoDB (local or MongoDB Atlas)
- npm or yarn package manager

**Required API Keys:**
- LiveKit API Key & Secret
- OpenAI API Key
- OpenWeatherMap API Key

## 🚀 Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/saba-1A/vaiu-ai-voiceagent.git
cd vaiu-ai-voiceagent
```

### 2. Install backend dependencies and run
```bash
pnpm build && pnpm start
pnpm download-files
```
*Additional dependencies (install if needed):*
```bash
npm install express
npm install --save-dev @types/express
pnpm add express mongoose cors
pnpm add -D @types/express @types/cors
pnpm add express mongoose cors body-parser
pnpm add zod
```

### 3. Install frontend dependencies
Currently, there is no separate frontend folder. Run this inside `vaiu-ai-voiceagent`:
```bash
pnpm install @livekit/agents@latest @livekit/agents-plugin-openai@latest @livekit/agents-plugin-silero@latest
```

### 4. Set up MongoDB
- **Option A:** Install MongoDB locally
- **Option B:** Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

## 🔐 Environment Variables

Create a `.env` file inside the `server` directory with the following content:

```env
# MongoDB connection URI
MONGODB_URI=
# Or for MongoDB Atlas:
# MONGODB_URI=

# LiveKit credentials
LIVEKIT_API_KEY=your_livekit_api_key
LIVEKIT_API_SECRET=your_livekit_api_secret
LIVEKIT_WS_URL=wss://your-livekit-instance.livekit.cloud

# OpenAI API key
OPENAI_API_KEY=your_openai_api_key

# OpenWeatherMap API key
OPENWEATHER_API_KEY=your_openweather_api_key
```

### Get API Keys
- LiveKit: [Sign up here](https://cloud.livekit.io/)
- OpenAI: [Get your API key](https://platform.openai.com/)
- OpenWeatherMap: [Register here](https://openweathermap.org/api)

## ▶️ Running the Application

### Start backend server
```bash
npx tsx backend/server.ts
```
The server will run at `http://localhost:5000`

### Start frontend
No separate frontend command; connect via LiveKit Playground and interact with the AI agent there.

## 📡 API Documentation

### Booking Endpoints

- **Create a Booking** (`POST /api/bookings`)
- **Get All Bookings** (`GET /api/bookings`)
- **Get Booking by ID** (`GET /api/bookings/:id`)
- **Cancel Booking** (`DELETE /api/bookings/:id`)

Example snippet for booking creation in code:
## 🎯 How It Works

### Conversation Flow
1. **Greeting:** Agent welcomes user
2. **Intent Recognition:** Uses OpenAI GPT to detect booking intent
3. **Information Collection:** Gathers party size, date/time, cuisine, special requests
4. **Weather Check:** Fetches real-time weather for booking date/location
5. **Seating Suggestion:** Suggests indoor or outdoor seating based on weather
6. **Confirmation:** Reviews details with the user via voice
7. **Storage:** Saves booking data to MongoDB

### NLP Examples

| User Input                          | Extracted Info                    |
|-----------------------------------|---------------------------------|
| "I want to book a table for 2"    | 2 guests                        |
| "Table for four next Friday at 7pm"| 4 guests, date, time            |
| "Do you have Italian restaurants?"| Cuisine preference               |
| "It's my anniversary"              | Special occasion recognition    |

### Weather Logic

```ts
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
```

## 🎥 Demo Videos

- Voice conversation flow with NLP and  Handle variations in user input-https://drive.google.com/file/d/1axinSFlb5j_fzBs0V5LqIH2NI_opwjxs/view?usp=sharing
- Full booking process including database saving-https://drive.google.com/file/d/19XhMQIHfXOD7sZLOEHqA0HCq2xPqsRah/view?usp=sharing
- 


## 📝 Database Schema

```js
const BookingSchema = new mongoose.Schema({
  customerName: String,
  numberOfGuests: Number,
  bookingDate: String,
  bookingTime: String,       
  cuisinePreference: String,
  specialRequests: String,   
  seatingPreference: String, 
  weatherInfo: String,       
  createdAt: { type: Date, default: Date.now }
});
```

## 🔧 Implementation Details

### LiveKit Integration
- Used LiveKit Agents Framework for real-time voice communication
- Configured speech-to-text and text-to-speech pipelines

### OpenAI Integration
- GPT-4 for intent extraction and dialogue management

### Weather Service
- Real-time weather fetches from OpenWeatherMap
- 7-day weather caching to optimize API use

## 🐛 Troubleshooting Tips

- **MongoDB Issues:**
  ```bash
  sudo systemctl status mongodb
  sudo systemctl start mongodb
  ```
- **LiveKit Connection Errors:**
  - Confirm API keys in `.env`
  - Check WebSocket URL format
  - Ensure firewall allows WebSocket traffic
- **OpenAI API Issues:**
  - Verify API key validity
  - Monitor API rate limits
  - Ensure billing is active

## 🚀 Future Enhancements

- Multi-language support (e.g., Hindi + English)
- SMS/Email booking confirmations via Twilio
- Admin dashboard for bookings management
- Calendar integration to check availability
