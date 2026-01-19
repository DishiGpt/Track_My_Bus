import express from 'express';
import Bus from '../models/Bus.js';
import User from '../models/User.js';

const router = express.Router();

// Get Driver Profile & Assigned Bus
router.get('/me/:id', async (req, res) => {
    try {
        const driver = await User.findById(req.params.id).populate('assignedBus');
        res.json(driver);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Toggle GPS / Update Location
// Note: In real app, this is likely a socket connection, but for HTTP polling:
router.post('/location', async (req, res) => {
    try {
        const { busId, lat, lng, isGpsActive } = req.body;

        const update = {
            isLive: isGpsActive, // If GPS is off, treat as not live? or separate flag?
            location: {
                lat,
                lng,
                lastUpdated: new Date()
            }
        };

        const bus = await Bus.findByIdAndUpdate(busId, update, { new: true });
        res.json(bus);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
