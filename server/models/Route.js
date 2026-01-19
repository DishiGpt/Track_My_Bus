import mongoose from 'mongoose';

const RouteSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }, // e.g., "Bhuwana-University"
    description: { type: String }, // optional text area content
    stops: [{
        stopName: { type: String },
        scheduledTime: { type: String },
        lat: { type: Number },
        lng: { type: Number }
    }],
    // For simple "text area" routes as requested by user
    rawRouteText: { type: String }
}, { timestamps: true });

export default mongoose.model('Route', RouteSchema);
