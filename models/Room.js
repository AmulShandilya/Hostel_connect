const mongoose = require("mongoose");
const User = require('./User');

const roomSchema = new mongoose.Schema({
  hostelName: {
    type: String,
    enum: ["Kautilya", "Aryabhatt", "Kadambari"],
    required: true,
  },
  roomNumber: {
    type: Number,
    required: true,
  },
  capacity: {
    type: Number,
    default: 2, // each room has 2 beds
  },
  occupants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

module.exports = mongoose.model("Room", roomSchema);
