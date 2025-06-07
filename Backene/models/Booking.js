const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  flight: { type: mongoose.Schema.Types.ObjectId, ref: "Flight", required: true },
  seats: [{ type: Number, required: true }],
  paid: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);

