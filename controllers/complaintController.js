const asyncHandler = require("express-async-handler");
const Complaint = require("../models/Complaint");
const Allocation = require("../models/Allocation");

// Submit a new complaint (Student)
const submitComplaint = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { title,message } = req.body;

  // Check student's allocated room
  const allocation = await Allocation.findOne({ student: userId });
  if (!allocation) {
    res.status(400);
    throw new Error("You don’t have a room allocated yet");
  }

  const complaint = await Complaint.create({
    student: userId,
    room: allocation.room,
    title,
     message
    
  });

  res.status(201).json({
    message: "Complaint submitted successfully",
    complaintId: complaint._id,
  });
});

// Get all complaints for the logged-in student
const getMyComplaints = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const complaints = await Complaint.find({ student: userId }).populate(
    "room",
    "hostelName roomNumber"
  );
  res.json(complaints);
});

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

module.exports = {
  submitComplaint,
  getMyComplaints,
  getAllComplaints,
  resolveComplaint,
};
