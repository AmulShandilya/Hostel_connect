// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { registerStudent, authUser, refreshToken } = require('../controllers/authController');

// Register (student self-register if in Student DB)
router.post('/register', asyncHandler(registerStudent));

// Login
router.post('/login', asyncHandler(authUser));

// Refresh token
router.post('/refresh', asyncHandler(refreshToken));

module.exports = router;
