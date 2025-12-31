const asyncHandler = require("express-async-handler");
const Complaint = require("../models/Complaint");

// Get all complaints (Admin)
const getAllComplaints = asyncHandler(async (req, res) => {
  const complaints = await Complaint.find()
    .populate("student", "username studentRoll")
    .populate("room", "hostelName roomNumber");
  res.json(complaints);
});

// Resolve a complaint (Admin)
const resolveComplaint = asyncHandler(async (req, res) => {
  const complaintId = req.params.id;

  const complaint = await Complaint.findById(complaintId);
  if (!complaint) {
    res.status(404);
    throw new Error("Complaint not found");
  }

  complaint.status = "Resolved";
  complaint.resolvedAt = Date.now();
  await complaint.save();

  res.json({ message: "Complaint resolved successfully" });
});

module.exports = { getAllComplaints, resolveComplaint };
