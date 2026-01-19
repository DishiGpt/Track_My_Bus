import express from 'express';
import Bus from '../models/Bus.js';
import User from '../models/User.js';
import Route from '../models/Route.js';

const router = express.Router();

// --- BUS MANAGEMENT ---

// Add Bus
router.post('/bus', async (req, res) => {
    try {
        const { busNumber, route, capacity } = req.body;
        const newBus = new Bus({ busNumber, route, capacity });
        await newBus.save();
        res.status(201).json(newBus);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get All Buses
router.get('/buses', async (req, res) => {
    try {
        // Populate driver info if needed
        const buses = await Bus.find().populate('driver', 'name phoneNumber');
        res.json(buses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update Bus Status (Disable/Enable for the day)
router.patch('/bus/:id', async (req, res) => {
    try {
        const { isDisabled } = req.body;
        const bus = await Bus.findByIdAndUpdate(req.params.id, { isDisabled }, { new: true });
        res.json(bus);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete Bus
router.delete('/bus/:id', async (req, res) => {
    try {
        await Bus.findByIdAndDelete(req.params.id);
        res.json({ message: 'Bus deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- DRIVER MANAGEMENT ---

// Add Driver
router.post('/driver', async (req, res) => {
    try {
        const { name, phoneNumber, assignedBusId } = req.body;
        // OTP logic could be here if "otp option when number entered" means triggering it now

        const newDriver = new User({
            name,
            phoneNumber,
            role: 'DRIVER',
            assignedBus: assignedBusId
        });
        await newDriver.save();

        // If bus assigned, update bus as well
        if (assignedBusId) {
            await Bus.findByIdAndUpdate(assignedBusId, { driver: newDriver._id, driverName: newDriver.name });
        }

        res.status(201).json(newDriver);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Drivers
router.get('/drivers', async (req, res) => {
    try {
        const drivers = await User.find({ role: 'DRIVER' }).populate('assignedBus');
        res.json(drivers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Edit Driver
router.put('/driver/:id', async (req, res) => {
    try {
        const { name, assignedBusId } = req.body;
        const driver = await User.findById(req.params.id);

        if (name) driver.name = name;
        if (assignedBusId && driver.assignedBus !== assignedBusId) {
            // Logic to swap bus driver if necessary
            driver.assignedBus = assignedBusId;
            await Bus.findByIdAndUpdate(assignedBusId, { driver: driver._id, driverName: driver.name });
        }

        await driver.save();
        res.json(driver);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
