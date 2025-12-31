const express = require("express");
const router = express.Router();
const {
  submitComplaint,
  getMyComplaints,
  getAllComplaints,
  resolveComplaint,
} = require("../controllers/complaintController");
const { protect, admin } = require("../middleware/authMiddleware");

// Student routes
router.post("/", protect, submitComplaint);
router.get("/my", protect, getMyComplaints);

// Admin routes
router.get("/", protect, admin, getAllComplaints);
router.put("/:id/resolve", protect, admin, resolveComplaint);

module.exports = router;
