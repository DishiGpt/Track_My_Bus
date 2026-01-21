const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    code: {
      type: String,
      required: true,
    },
    purpose: {
      type: String,
      enum: ['signup', 'login', 'password-reset'],
      default: 'login',
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 600, // Auto delete after 10 minutes
    },
  }
);

module.exports = mongoose.model('OTP', otpSchema);
