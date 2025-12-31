const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  roll: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  branch: { type: String, required: true },
  gender: { type: String, enum: ['male', 'female'], required: true },
  email: String,
  phone: String,
}, { timestamps: true });

module.exports = mongoose.model('Student', StudentSchema);
