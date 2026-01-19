import mongoose from 'mongoose';

const BusSchema = new mongoose.Schema({
    busNumber: { type: String, required: true, unique: true },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to a Driver user
    driverName: { type: String }, // Redundant but helpful for quick display
    driverPhone: { type: String },
    route: { type: String, required: true }, // Route Name e.g. "Bhuwana" or Object ID if using Route model
    capacity: { type: Number, default: 40 },
    departureTime: { type: String }, // e.g. "08:00 AM"

    // Live Status
    isLive: { type: Boolean, default: false },
    location: {
        lat: { type: Number },
        lng: { type: Number },
        lastUpdated: { type: Date }
    },

    isDisabled: { type: Boolean, default: false } // For daily availability check
}, { timestamps: true });

export default mongoose.model('Bus', BusSchema);
