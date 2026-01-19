import express from 'express';
import Bus from '../models/Bus.js';
import Route from '../models/Route.js';

const router = express.Router();

// Get All Routes (for dropdown)
router.get('/routes', async (req, res) => {
    try {
        // If we have a separate Route model, fetch there. 
        // Or just distinct routes from Buses if simple.
        // User requested "Bus Page" crude, so likely 'Route' model content or just strings.
        // For now assuming routes are strings on buses or Route model.
        const routes = await Route.find(); // If using Route model
        res.json(routes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Buses for a Route (Live Today)
router.get('/buses/:routeName', async (req, res) => {
    try {
        const { routeName } = req.params;
        const buses = await Bus.find({
            route: routeName,
            isDisabled: false // "list of buses live today"
        }).select('busNumber driverName isLive location');

        res.json(buses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
