import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();
app.use(cors());
app.use(express.json());

// --- 1. MONGODB CONNECTION ---
const MONGO_URI = "mongodb+srv: ";

console.log("⏳ Connecting to MongoDB Cloud...");

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas (Cloud)'))
  .catch((err) => console.log('❌ MongoDB Error:', err));

// --- 2. UPDATED SCHEMA ---
const BookingSchema = new mongoose.Schema({
  customerName: String,
  numberOfGuests: Number,
  bookingDate: String,
  bookingTime: String,       // Added
  cuisinePreference: String,
  specialRequests: String,   // Added
  seatingPreference: String, // Added
  weatherInfo: String,       // Added
  createdAt: { type: Date, default: Date.now }
});

const Booking = mongoose.model('Booking', BookingSchema);

// --- 3. API ROUTES ---

// POST: Save a new booking
app.post('/api/bookings', async (req, res) => {
  console.log("📝 Incoming Booking:", req.body);
  
  try {
    const newBooking = new Booking(req.body);
    await newBooking.save(); 
    console.log("💾 Saved to Cloud Database!");
    res.status(201).json({ success: true, message: "Booking saved", id: newBooking._id });
  } catch (error) {
    console.error("Error saving:", error);
    res.status(500).json({ success: false, message: "Failed to save" });
  }
});

// GET: View all bookings
app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: "Could not fetch bookings" });
  }
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend Server running on http://localhost:${PORT}`);
});