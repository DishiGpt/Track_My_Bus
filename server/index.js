import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import coordinatorRoutes from './routes/coordinator.js';
import driverRoutes from './routes/driver.js';
import studentRoutes from './routes/student.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/coordinator', coordinatorRoutes);
app.use('/api/driver', driverRoutes);
app.use('/api/student', studentRoutes); // For viewing routes/buses

app.get('/', (req, res) => {
    res.send('Track My Bus API is Running');
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
