import express from 'express';
import User from '../models/User.js';
import Bus from '../models/Bus.js';
import Route from '../models/Route.js';

const router = express.Router();

// Middleware to check Admin Role (simplified)
const isAdmin = async (req, res, next) => {
    // In real app, verify JWT here. For now assuming auth middleware isn't blocking development
    next();
};

// DASHBOARD ANALYTICS
router.get('/analytics', async (req, res) => {
    try {
        const students = await User.countDocuments({ role: 'STUDENT' });
        const drivers = await User.countDocuments({ role: 'DRIVER' });
        const buses = await Bus.countDocuments({});
        const activeBuses = await Bus.countDocuments({ isLive: true });

        res.json({ students, drivers, buses, activeBuses });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// MANAGE COORDINATORS
router.post('/coordinator', async (req, res) => {
    try {
        const { name, phoneNumber } = req.body;
        // Create coordinator logic...
        const newUser = new User({ name, phoneNumber, role: 'COORDINATOR' });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/coordinators', async (req, res) => {
    try {
        const coords = await User.find({ role: 'COORDINATOR' });
        res.json(coords);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// BROADCAST (Mock)
router.post('/broadcast', async (req, res) => {
    const { message, audience } = req.body;
    console.log(`[BROADCAST] To ${audience}: ${message}`);
    res.json({ message: 'Broadcast sent' });
});

export default router;
