const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['student', 'warden', 'admin'], default: 'student' },
  studentRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
