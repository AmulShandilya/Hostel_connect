const mongoose = require('mongoose');

const HostelSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  genderAllowed: { type: String, enum: ['male', 'female', 'mixed'], required: true },
  location: String
}, { timestamps: true });

module.exports = mongoose.model('Hostel', HostelSchema);
