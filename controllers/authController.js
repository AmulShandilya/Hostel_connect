// controllers/authController.js
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Student = require('../models/student');
const generateToken = require('../utils/generateToken');

const signRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });
};

// @desc   Register a student (only if exists in Student DB)
// @route  POST /api/auth/register
// @access Public
const registerStudent = asyncHandler(async (req, res) => {
  const { username, password, studentRoll } = req.body;

  if (!username || !password || !studentRoll) {
    res.status(400);
    throw new Error('username, password and studentRoll are required');
  }

  // find student in Student DB
  const studentDoc = await Student.findOne({ roll: studentRoll });
  if (!studentDoc) {
    res.status(400);
    throw new Error('Student not found in master database');
  }

  // check if already registered
  const existing = await User.findOne({ studentRef: studentDoc._id });
  if (existing) {
    res.status(400);
    throw new Error('Account already registered for this student');
  }

  // hash password
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const user = await User.create({
    username,
    passwordHash,
    role: 'student',
    studentRef: studentDoc._id
  });

  if (user) {
    const accessToken = generateToken(user._id);
    const refreshToken = signRefreshToken(user._id);

    res.status(201).json({
      _id: user._id,
      username: user.username,
      role: user.role,
      studentRoll: studentDoc.roll,
      accessToken,
      refreshToken
    });
  } else {
    res.status(400);
    throw new Error('Unable to register');
  }
});

// @desc   Login user (student or admin/warden if exists)
// @route  POST /api/auth/login
// @access Public
const authUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (user && (await bcrypt.compare(password, user.passwordHash))) {
    const accessToken = generateToken(user._id);
    const refreshToken = signRefreshToken(user._id);

    const student = user.studentRef ? await Student.findById(user.studentRef) : null;

    res.json({
      _id: user._id,
      username: user.username,
      role: user.role,
      studentRoll: student ? student.roll : null,
      accessToken,
      refreshToken
    });
  } else {
    res.status(401);
    throw new Error('Invalid username or password');
  }
});

// @desc   Refresh access token
// @route  POST /api/auth/refresh
// @access Public
const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken: incomingRefresh } = req.body;
  if (!incomingRefresh) {
    res.status(400);
    throw new Error('Refresh token required');
  }

  try {
    const decoded = jwt.verify(incomingRefresh, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      res.status(401);
      throw new Error('Invalid refresh token');
    }

    const newAccessToken = generateToken(user._id);
    const newRefreshToken = signRefreshToken(user._id);

    res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (err) {
    res.status(401);
    throw new Error('Invalid or expired refresh token');
  }
});

module.exports = { registerStudent, authUser, refreshToken };
