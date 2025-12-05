# 🍽️ Restaurant Booking Voice Agent

An intelligent voice-enabled AI agent built with LiveKit that helps users book restaurant tables through natural conversation. The agent uses OpenAI's GPT for natural language understanding and provides real-time weather information to suggest optimal seating arrangements.

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [How It Works](#how-it-works)
- [Demo](#demo)

## ✨ Features

### Core Features
- **Voice Interaction**: Real-time speech-to-text and text-to-speech using LiveKit
- **Intelligent Conversation**: OpenAI GPT-powered natural language processing
- **Weather Integration**: Real-time weather forecasting with OpenWeatherMap API
- **Smart Seating Suggestions**: Indoor/outdoor recommendations based on weather conditions
- **Database Storage**: Persistent booking storage in MongoDB
- **RESTful API**: Complete CRUD operations for booking management

### Bonus Features Implemented
- **Natural Language Processing**: Handles variations in user input
  - "I want to book a table" ✅
  - "Table for 2" ✅
- **Context-Aware Responses**: Maintains conversation context throughout the booking process
- **Flexible Input Handling**: Understands different ways of expressing dates, times, and preferences

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
- **LiveKit**: Voice agent framework for real-time communication
- **OpenAI GPT API**: Natural language understanding and conversation
- **OpenWeatherMap API**: Real-time weather data

### Database
- MongoDB Atlas (or local MongoDB)

## 📦 Prerequisites

Before running this project, ensure you have:

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn package manager

**API Keys Required:**
- LiveKit API Key & Secret
- OpenAI API Key
- OpenWeatherMap API Key

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/restaurant-booking-agent.git
cd restaurant-booking-agent
```

### 2. Install Backend Dependencies
```bash
cd server
npm install
```

### 3. Install Frontend Dependencies
```bash
pnpm or npm depencies
```

### 4. Set Up MongoDB
- **Option A**: Install MongoDB locally
- **Option B**: Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

## 🔐 Environment Variables

Create a `.env` file in the `server` directory:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/restaurant-bookings
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/restaurant-bookings

# LiveKit Configuration
LIVEKIT_API_KEY=your_livekit_api_key
LIVEKIT_API_SECRET=your_livekit_api_secret
LIVEKIT_WS_URL=wss://your-livekit-instance.livekit.cloud

# OpenAI API
OPENAI_API_KEY=your_openai_api_key

# OpenWeatherMap API
OPENWEATHER_API_KEY=your_openweather_api_key
```

### Getting API Keys

1. **LiveKit**: Sign up at [LiveKit Cloud](https://cloud.livekit.io/)
2. **OpenAI**: Get your API key from [OpenAI Platform](https://platform.openai.com/)
3. **OpenWeatherMap**: Register at [OpenWeatherMap](https://openweathermap.org/api)

## ▶️ Running the Application

### Start Backend Server
```bash
npx tsx backend/server.ts
Server runs on `http://localhost:5000`

### Start Frontend
npm run dev (I connect through the LiveKit Playground. Once it’s connected, I use the Agent AI there to interact)

## 📡 API Documentation

### Bookings Endpoints

#### Create a New Booking
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

#### Get All Bookings
```http
GET /api/bookings
```

#### Get Specific Booking
```http
GET /api/bookings/:id
```

#### Cancel Booking
```http
DELETE /api/bookings/:id
```

## 🎯 How It Works

### Conversation Flow

1. **Greeting**: The voice agent welcomes the user and asks how it can help
2. **Intent Recognition**: Using OpenAI GPT, the agent understands booking intent from natural language
3. **Information Collection**: The agent collects:
   - Number of guests
   - Preferred date and time
   - Cuisine preference
   - Special requests
4. **Weather Check**: The system fetches real-time weather for the booking date
5. **Seating Suggestion**: Based on weather conditions, suggests indoor or outdoor seating
6. **Confirmation**: Reviews all details with the user via voice
7. **Storage**: Saves the booking to MongoDB database

### Natural Language Processing

The agent uses OpenAI's GPT model to understand various input formats:

**Examples:**
- "I want to book a table for 2" → Extracts: 2 guests
- "Table for four next Friday at 7pm" → Extracts: 4 guests, date, time
- "Do you have Italian restaurants?" → Understands cuisine preference
- "It's my anniversary" → Recognizes special occasion

### Weather Integration Logic
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


## 🎥 Demo

[Include a link to your screen recording here - 2-3 minutes showing the voice agent in action]

**Demo includes:**
- Voice conversation flow
- Weather API integration
- Database storage
- Booking confirmation

## 📝 Database Schema
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

## 🔧 Key Implementation Details

### LiveKit Integration
- Used LiveKit Agents Framework for voice communication
- Implemented real-time audio streaming
- Configured STT and TTS pipelines

### OpenAI Integration
- GPT-4 for natural language understanding
- Context-aware conversation management
- Intent extraction and entity recognition

### Weather Service
- Real-time forecast fetching from OpenWeatherMap
- 7-day weather data caching to reduce API calls
- Intelligent seating recommendations based on conditions

## 🐛 Troubleshooting

**MongoDB Connection Issues:**
```bash
# Check MongoDB is running
sudo systemctl status mongodb
# Or start MongoDB
sudo systemctl start mongodb
```

**LiveKit Connection Errors:**
- Verify API keys in `.env` file
- Check WebSocket URL format
- Ensure firewall allows WebSocket connections

**OpenAI API Errors:**
- Verify API key is valid
- Check API usage limits
- Ensure billing is set up on OpenAI platform

## 🚀 Future Enhancements

- Multi-language support (Hindi + English)
- SMS/Email confirmations via Twilio
- Admin dashboard for booking management
- Calendar integration for availability checking

## 👨‍💻 Author

[SABA FATHIMA]
- GitHub: [@yourusername](https://github.com/saba-1A)

## 📄 License

This project is created as part of the Vaiu AI Software Developer Internship Assignment.

---

**Note**: This is a demonstration project built for educational purposes. For production use, additional security measures, error handling, and scalability considerations would be required.