// src/components/student/StudentSettings.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';

const StudentSettings = () => {
    const { user, updateProfile } = useAuth();
    const [profileData, setProfileData] = useState({ name: '' });
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (user) {
            setProfileData({ name: user.name || '' });
        }
    }, [user]);

    const handleUpdateProfile = async () => {
        if (!profileData.name.trim()) {
            setMessage({ type: 'error', text: 'Name is required' });
            return;
        }

        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            const result = await updateProfile(profileData.name);
            if (result.success) {
                setMessage({ type: 'success', text: 'Profile updated successfully!' });
            } else {
                setMessage({ type: 'error', text: result.message || 'Failed to update profile' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update profile' });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-md">
            <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>

            {message.text && (
                <div className={`p-3 rounded mb-4 ${message.type === 'success'
                        ? 'bg-green-100 text-green-700 border border-green-300'
                        : 'bg-red-100 text-red-700 border border-red-300'
                    }`}>
                    {message.text}
                </div>
            )}

            <div className="space-y-4">
                {/* Name Field */}
                <div>
                    <label className="block text-gray-700 font-semibold mb-2">Name</label>
                    <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your name"
                    />
                </div>

                {/* Phone Field (Read-only) */}
                <div>
                    <label className="block text-gray-700 font-semibold mb-2">Phone</label>
                    <input
                        type="text"
                        value={user?.phone || ''}
                        disabled
                        className="w-full border rounded px-4 py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">Phone number cannot be changed</p>
                </div>

                {/* Role Field (Read-only) */}
                {/* <div>
                    <label className="block text-gray-700 font-semibold mb-2">Role</label>
                    <input
                        type="text"
                        value={user?.role || 'Student'}
                        disabled
                        className="w-full border rounded px-4 py-2 bg-gray-100 text-gray-500 cursor-not-allowed capitalize"
                    />
                </div> */}

                {/* Update Button */}
                <button
                    onClick={handleUpdateProfile}
                    disabled={saving}
                    className="w-full bg-green-600 text-white py-3 rounded font-semibold hover:bg-green-700 disabled:bg-gray-400 transition"
                >
                    {saving ? 'Saving...' : 'Update Profile'}
                </button>
            </div>

            {/* Account Info Section */}
            <div className="mt-8 p-4 bg-gray-50 rounded">
                <h3 className="font-semibold mb-2">Account Information</h3>
                <p className="text-sm text-gray-600">
                    Your account is linked to your phone number. To track buses,
                    go to the "Track Bus" tab and select a bus to see its live location.
                </p>
            </div>
        </div>
    );
};

export default StudentSettings;
