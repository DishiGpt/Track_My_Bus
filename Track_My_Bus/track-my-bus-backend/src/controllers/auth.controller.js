const User = require('../models/User.model');
const { createOTP, verifyOTP } = require('../utils/otp.utils');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// Request OTP for signup/login
exports.requestOTP = async (req, res) => {
  try {
    const { phone, email, purpose } = req.body; // purpose: 'signup' or 'login'

    if (!phone && !email) {
      return res.status(400).json({
        success: false,
        message: 'Phone or email required',
      });
    }

    // Check if user exists for login
    if (purpose === 'login') {
      let user;
      if (phone) {
        user = await User.findOne({ phone });
      } else {
        user = await User.findOne({ email });
      }

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found. Please sign up first.',
        });
      }
    }

    // Generate and send OTP
    await createOTP(phone, email, purpose);

    res.json({
      success: true,
      message: 'OTP sent successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error sending OTP',
      error: error.message,
    });
  }
};

// Signup
exports.signup = async (req, res) => {
  try {
    const { name, phone, email, otp, password } = req.body;

    // Verify OTP
    const { valid } = await verifyOTP(phone, email, otp);
    if (!valid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP',
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists',
      });
    }

    // Create user
    const user = new User({
      name,
      phone,
      email,
      passwordHash: password || 'default-password',
      role: 'student',
      isVerified: true,
      profileComplete: true,
    });

    await user.save();

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: 'Signup successful',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Signup failed',
      error: error.message,
    });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { phone, email, otp } = req.body;

    // Verify OTP
    const { valid } = await verifyOTP(phone, email, otp);
    if (!valid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP',
      });
    }

    // Find user
    let user;
    if (phone) {
      user = await User.findOne({ phone });
    } else {
      user = await User.findOne({ email });
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const token = generateToken(user._id, user.role);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message,
    });
  }
};

// Get profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-passwordHash');
    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message,
    });
  }
};

// Update profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { name, email },
      { new: true }
    ).select('-passwordHash');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message,
    });
  }
};
