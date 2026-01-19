import express from 'express';
import User from '../models/User.js';
import otpGenerator from 'otp-generator';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Mock function to send OTP
const sendOTP = async (contact, otp, type) => {
    console.log(`[MOCK OTP] Sending ${otp} to ${contact} via ${type}`);
    return true;
};

// SIGNUP (Student mainly, or initial Admin seeded)
router.post('/signup', async (req, res) => {
    try {
        const { name, email, phoneNumber, role } = req.body;

        // Check if user exists
        let user = await User.findOne({ phoneNumber });
        if (user) return res.status(400).json({ message: 'User already exists' });

        // Generate OTP
        const otp = otpGenerator.generate(6, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

        user = new User({
            name,
            email,
            phoneNumber,
            role: role || 'STUDENT', // Default to Student
            otp,
            otpExpires
        });

        await user.save();
        await sendOTP(phoneNumber, otp, 'SMS');

        res.status(201).json({ message: 'OTP sent successfully', userId: user._id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// LOGIN (Phone/Email)
router.post('/login', async (req, res) => {
    try {
        const { contact, isEmail } = req.body; // contact can be phone or email

        const query = isEmail ? { email: contact } : { phoneNumber: contact };
        const user = await User.findOne(query);

        if (!user) return res.status(404).json({ message: 'User not found' });

        // Generate OTP
        const otp = otpGenerator.generate(6, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
        user.otp = otp;
        user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();

        await sendOTP(contact, otp, isEmail ? 'EMAIL' : 'SMS');

        res.json({ message: 'OTP sent successfully', userId: user._id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// VERIFY OTP
router.post('/verify-otp', async (req, res) => {
    try {
        const { userId, otp } = req.body;
        const user = await User.findById(userId);

        if (!user) return res.status(404).json({ message: 'User not found' });
        if (user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: 'Invalid or Expired OTP' });
        }

        // Clear OTP
        user.otp = undefined;
        user.otpExpires = undefined;
        user.isVerified = true;
        await user.save();

        // Generate Token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.json({ token, user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
