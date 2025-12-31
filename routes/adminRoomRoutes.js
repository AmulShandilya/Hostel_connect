const express = require("express");
const router = express.Router();
const {
  addRoom,
  getAllRooms,
  updateRoom,
  deleteRoom,
} = require("../controllers/adminRoomController");

const { protect, admin } = require("../middleware/authMiddleware");

// All routes protected & admin only
router.post("/", protect, admin, addRoom);
router.get("/", protect, admin, getAllRooms);
router.put("/:id", protect, admin, updateRoom);
router.delete("/:id", protect, admin, deleteRoom);

module.exports = router;
