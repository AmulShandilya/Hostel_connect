const asyncHandler = require("express-async-handler");
const Room = require("../models/Room");
const Allocation = require("../models/Allocation");
const User = require("../models/User");
const Student = require("../models/student");

// Allocate room
const allocateRoom = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const user = await User.findById(userId).populate("studentRef");

  if (!user) throw new Error("User not found");

  const { gender } = user.studentRef;

  // Check if user already has a room
  const existingAllocation = await Allocation.findOne({ student: userId });
  if (existingAllocation) {
    res.status(400);
    throw new Error("You already have a room allocated");
  }

  // Choose hostel based on gender
  const validHostels =
    gender === "Male" ? ["Kautilya", "Aryabhatt"] : ["Kadambari"];

  // Find room with available space
  const room = await Room.findOne({
  hostelName: { $in: validHostels },
  $expr: { $lt: [{ $size: "$occupants" }, "$capacity"] }
});


  if (!room) {
    res.status(400);
    throw new Error("No rooms available in your hostel");
  }

  // Allocate room
  room.occupants.push(userId);
  await room.save();

  const allocation = await Allocation.create({
    student: userId,
    room: room._id,
  });

  res.status(201).json({
    message: "Room allocated successfully",
    roomNumber: room.roomNumber,
    hostel: room.hostelName,
  });
});

// Get user's room details
const getMyRoom = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const allocation = await Allocation.findOne({ student: userId }).populate({
    path: "room",
    populate: { path: "occupants", select: "username" },
  });

  if (!allocation) {
    res.status(404);
    throw new Error("No room allocated");
  }

  res.json(allocation);
});

module.exports = { allocateRoom, getMyRoom };
