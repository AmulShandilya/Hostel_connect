const mongoose = require("mongoose");
const Room = require('./Room');
const User = require('./User');

const allocationSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true, // one student = one allocation
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
    required: true,
  },
  dateAllocated: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Allocation", allocationSchema);
