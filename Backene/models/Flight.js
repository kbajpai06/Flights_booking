const mongoose = require("mongoose");

const flightSchema = new mongoose.Schema({
  airline: String,
  flightNumber: String,
  departure: {
    time: String,
    airport: String,
    city: String,
  },
  arrival: {
    time: String,
    airport: String,
    city: String,
  },
  duration: String,
  price: Number,
  aircraft: String,
});


module.exports = mongoose.model("Flight", flightSchema);
