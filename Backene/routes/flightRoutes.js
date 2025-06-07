const express = require("express");
const router = express.Router();
const Flight = require("../models/Flight");
const auth = require("../Middleware/authMiddleware");

// @route   POST /api/flights
// @desc    Add a new flight (admin only)
router.post("/", auth, async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json({ message: "Access denied" });

    const newFlight = new Flight(req.body);
    await newFlight.save();
    res.status(201).json(newFlight);
    console.log("Flight saved:", newFlight);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route   GET /api/flights
// @desc    Get all flights (optional search with ?from=DEL&to=MUM)
router.get("/", async (req, res) => {
  try {
    const query = {};
    if (req.query.from) query["departure.city"] = req.query.from;
    if (req.query.to) query["arrival.city"] = req.query.to;

    const flights = await Flight.find(query);

    // Convert _id to id
    const flightsWithId = flights.map((flight) => ({
      ...flight.toObject(),
      id: flight._id.toString(),
    }));

    res.json(flightsWithId);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


// @route   GET /api/flights/:id
// @desc    Get flight by ID (for seat selection)
router.get("/:id", async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id);
    if (!flight) return res.status(404).json({ message: "Flight not found" });
    res.json(flight);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
