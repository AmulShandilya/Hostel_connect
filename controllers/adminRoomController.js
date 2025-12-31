const asyncHandler = require("express-async-handler");
const Room = require("../models/Room");

// =======================
// Admin: Add new room
// =======================
const addRoom = asyncHandler(async (req, res) => {
  const { hostelName, roomNumber } = req.body;

  // Check if room already exists in same hostel
  const roomExists = await Room.findOne({ hostelName, roomNumber });
  if (roomExists) {
    res.status(400);
    throw new Error("Room already exists in this hostel");
  }

  const room = await Room.create({
    hostelName,
    roomNumber,
    // capacity and occupants come from schema defaults
  });

  res.status(201).json({ message: "Room created successfully", room });
});

// =======================
// Admin: Get all rooms
// =======================
const getAllRooms = asyncHandler(async (req, res) => {
  const rooms = await Room.find().populate("occupants", "username studentRoll");
  res.json(rooms);
});

// =======================
// Admin: Update room
// =======================
const updateRoom = asyncHandler(async (req, res) => {
  const { roomNumber } = req.body;
  const room = await Room.findById(req.params.id);

  if (!room) {
    res.status(404);
    throw new Error("Room not found");
  }

  room.roomNumber = roomNumber || room.roomNumber;
  await room.save();

  res.json({ message: "Room updated successfully", room });
});

// =======================
// Admin: Delete room
// =======================
const deleteRoom = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id);

  if (!room) {
    res.status(404);
    throw new Error("Room not found");
  }

  await room.deleteOne();
  res.json({ message: "Room deleted successfully" });
});

module.exports = { addRoom, getAllRooms, updateRoom, deleteRoom };
