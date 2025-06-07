const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const Flight = require("../models/Flight");
const auth = require("../Middleware/authMiddleware");

// POST /api/bookings - Book seats
router.post("/", auth, async (req, res) => {
  try {
    const { flightId, seatNumbers } = req.body;

    if (!flightId || !Array.isArray(seatNumbers) || seatNumbers.length === 0) {
      return res.status(400).json({ message: "Flight ID and at least one seat number are required" });
    }

    const flight = await Flight.findById(flightId);
    if (!flight) return res.status(404).json({ message: "Flight not found" });

    // Check if any seat is already booked
    const alreadyBooked = seatNumbers.some(seat => flight.bookedSeats.includes(seat));
    if (alreadyBooked) {
      return res.status(400).json({ message: "One or more selected seats are already booked" });
    }

    // Add new seats to flight's bookedSeats
    flight.bookedSeats.push(...seatNumbers);
    await flight.save();

    // Create booking
    const booking = new Booking({
      user: req.user.id,
      flight: flightId,
      seats: seatNumbers,     // 🔄 changed from seatNumber to seats
      paid: false
    });
    console.log("req.user", req.user);
    await booking.save();



    res.status(201).json({ message: "Booking successful", booking });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});
router.get("/", auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate("flight");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;

