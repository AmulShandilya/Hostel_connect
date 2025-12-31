const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  allocateRoom,
  getMyRoom
} = require("../controllers/roomController");
const Room = require("../models/Room");

/**
 * Student: allocate room automatically (based on gender)
 */
router.post("/allocate", protect, allocateRoom);

/**
 * Student: get my room
 */
router.get("/my", protect, getMyRoom);

/**
 * Get available rooms by hostel (PUBLIC – for dropdown)
 */
/**
 * Get available rooms by hostel (PUBLIC – for dropdown)
 */
router.get("/available/:hostelName", async (req, res) => {
  const { hostelName } = req.params; // <-- fix: extract hostelName from params
  try {
    const rooms = await Room.find({ hostelName });
    const availableRooms = rooms.filter(
      (r) => r.occupants.length < r.capacity
    );
    res.json(availableRooms);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch rooms" });
  }
});


module.exports = router;
