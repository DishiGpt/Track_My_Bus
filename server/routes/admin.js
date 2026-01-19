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

// --- STUDENT MANAGEMENT ---

// Add Student
router.post('/student', async (req, res) => {
    try {
        const { name, email, phoneNumber } = req.body;
        // Check if exists
        let user = await User.findOne({ phoneNumber });
        if (user) return res.status(400).json({ message: 'User already exists' });

        // Generate initial OTP (as per requirement to have OTP details)
        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Simple numeric OTP
        const otpExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours for admin created

        const newStudent = new User({
            name,
            email,
            phoneNumber,
            role: 'STUDENT',
            otp,
            otpExpires
        });
        await newStudent.save();
        res.status(201).json(newStudent);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get All Students
router.get('/students', async (req, res) => {
    try {
        const students = await User.find({ role: 'STUDENT' });
        res.json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update Student
router.put('/student/:id', async (req, res) => {
    try {
        const { name, email, phoneNumber } = req.body;
        const student = await User.findByIdAndUpdate(
            req.params.id,
            { name, email, phoneNumber },
            { new: true }
        );
        res.json(student);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete Student
router.delete('/student/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'Student deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- ROUTE MANAGEMENT ---

// Add Route
router.post('/route', async (req, res) => {
    try {
        const { name, rawRouteText } = req.body;
        // Basic implementation: assuming rawRouteText is the "text area" content
        // In a real app, you might parse stops from this text
        const newRoute = new Route({
            name,
            rawRouteText,
            stops: [] // Empty stops for now if just using text
        });
        await newRoute.save();
        res.status(201).json(newRoute);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get All Routes
router.get('/routes', async (req, res) => {
    try {
        const routes = await Route.find();
        res.json(routes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update Route
router.put('/route/:id', async (req, res) => {
    try {
        const { name, rawRouteText } = req.body;
        const route = await Route.findByIdAndUpdate(
            req.params.id,
            { name, rawRouteText },
            { new: true }
        );
        res.json(route);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete Route
router.delete('/route/:id', async (req, res) => {
    try {
        await Route.findByIdAndDelete(req.params.id);
        res.json({ message: 'Route deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- DRIVER MANAGEMENT (Admin Override) ---

// Get Drivers (Reuse or explicit)
router.get('/drivers', async (req, res) => {
    try {
        const drivers = await User.find({ role: 'DRIVER' }).populate('assignedBus');
        res.json(drivers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Note: Driver ADD/EDIT/DELETE can largely reuse the Coordinator's logic or duplicated here if strict separation needed.
// For now, we'll rely on the frontend calling the appropriate endpoints or add wrappers if needed.
// Adding a wrapper for adding Access-Control-Allow-Origin if strictly separate. 
// Actually, let's add specific Admin-driver endpoints to be safe.

router.post('/driver', async (req, res) => {
    try {
        const { name, phoneNumber, assignedBusId } = req.body;
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        const newDriver = new User({
            name,
            phoneNumber,
            role: 'DRIVER',
            otp,
            assignedBus: assignedBusId
        });
        await newDriver.save();

        if (assignedBusId) {
            await Bus.findByIdAndUpdate(assignedBusId, { driver: newDriver._id, driverName: newDriver.name });
        }
        res.status(201).json(newDriver);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/driver/:id', async (req, res) => {
    try {
        const { name, phoneNumber, assignedBusId } = req.body;
        const updateData = { name, phoneNumber };
        if (assignedBusId) updateData.assignedBus = assignedBusId;

        const driver = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (assignedBusId) {
            await Bus.findByIdAndUpdate(assignedBusId, { driver: driver._id, driverName: driver.name });
        }
        res.json(driver);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/driver/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'Driver deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


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
        const buses = await Bus.find().populate('driver', 'name phoneNumber');
        res.json(buses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update Bus
router.put('/bus/:id', async (req, res) => {
    try {
        const { busNumber, route, capacity, isDisabled } = req.body;
        const bus = await Bus.findByIdAndUpdate(
            req.params.id,
            { busNumber, route, capacity, isDisabled },
            { new: true }
        );
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

// BROADCAST (Mock)
router.post('/broadcast', async (req, res) => {
    const { message, audience } = req.body;
    console.log(`[BROADCAST] To ${audience}: ${message}`);
    // In a real app, this would trigger nodemailer or push notifications
    res.json({ message: `Broadcast sent to ${audience}` });
});

export default router;
