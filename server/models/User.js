import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String }, // Optional for some roles, but good to have
    phoneNumber: { type: String, required: true, unique: true },
    password: { type: String }, // For Admin/Coordinator primarily, or if we use password auth
    role: {
        type: String,
        enum: ['STUDENT', 'DRIVER', 'COORDINATOR', 'ADMIN'],
        default: 'STUDENT'
    },
    otp: { type: String }, // For OTP verification
    otpExpires: { type: Date },
    isVerified: { type: Boolean, default: false },

    // Driver specific fields
    assignedBus: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus' },

    // Student specific settings
    settings: {
        language: { type: String, default: 'en' }, // 'en' or 'hi'
        preferredRoute: { type: String }
    }
}, { timestamps: true });

export default mongoose.model('User', UserSchema);
