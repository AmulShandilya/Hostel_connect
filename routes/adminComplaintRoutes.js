const express = require("express");
const router = express.Router();
const {
  getAllComplaints,
  resolveComplaint,
} = require("../controllers/adminComplaintController");
const { protect, admin } = require("../middleware/authMiddleware");

// All routes protected & admin only
router.get("/", protect, admin, getAllComplaints);
router.put("/:id/resolve", protect, admin, resolveComplaint);

module.exports = router;
