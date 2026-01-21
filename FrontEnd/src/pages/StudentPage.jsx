import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { busAPI } from '../utils/api';

const StudentPage = () => {
  const { user, logout, updateProfile } = useAuth();
  const [buses, setBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('buses');
  const [profileData, setProfileData] = useState({ name: '' });
  const [saving, setSaving] = useState(false);

  const tabs = [
    { id: 'buses', label: 'Available Buses', icon: '🚌' },
    { id: 'track', label: 'Track Bus', icon: '📍' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  useEffect(() => {
    fetchBuses();
  }, []);

  useEffect(() => {
    if (user) {
      setProfileData({ name: user.name || '' });
    }
  }, [user]);

  const fetchBuses = async () => {
    setLoading(true);
    try {
      const response = await busAPI.getBusesForToday();
      if (response.data.success) {
        setBuses(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching buses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    setSaving(true);
    try {
      await updateProfile(profileData.name);
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-600 text-white p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">🚌 Track My Bus</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm bg-blue-700 px-3 py-1 rounded-full">
              {user?.name} (Student)
            </span>
            <button
              onClick={logout}
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-4">
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-6 bg-white p-3 rounded-lg shadow">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition ${activeTab === t.id
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow p-6">
          {/* Buses Tab */}
          {activeTab === 'buses' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Available Buses Today</h2>
              {loading ? (
                <p>Loading buses...</p>
              ) : buses.length === 0 ? (
                <p className="text-gray-600">No buses available today</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {buses.map((bus) => (
                    <div key={bus._id} className="bg-gray-50 p-4 rounded-lg border hover:shadow-lg transition">
                      <h3 className="font-bold text-lg mb-2">🚌 {bus.busNumber}</h3>
                      <p className="text-gray-600">📍 Route: {bus.route?.name}</p>
                      <p className="text-gray-600">⏰ Departure: {bus.departureTime}</p>
                      <p className="text-gray-600">👤 Driver: {bus.driver?.name}</p>
                      <button
                        onClick={() => setSelectedBus(bus)}
                        className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                      >
                        View Details
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Track Tab */}
          {activeTab === 'track' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Track Your Bus</h2>
              {buses.length === 0 ? (
                <p className="text-gray-600">No buses to track</p>
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-600 mb-4">Select a bus to see its live location:</p>
                  {buses.map((bus) => (
                    <div key={bus._id} className="bg-gray-50 p-4 rounded-lg border flex justify-between items-center">
                      <div>
                        <h3 className="font-bold">🚌 {bus.busNumber}</h3>
                        <p className="text-sm text-gray-600">{bus.route?.name}</p>
                      </div>
                      <div className="text-right">
                        {bus.currentLocation ? (
                          <span className="text-green-600 text-sm">📍 Live tracking available</span>
                        ) : (
                          <span className="text-gray-400 text-sm">📍 Location not available</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="max-w-md">
              <h2 className="text-2xl font-bold mb-4">Profile Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Name</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full border rounded px-4 py-2"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Phone</label>
                  <input
                    type="text"
                    value={user?.phone || ''}
                    disabled
                    className="w-full border rounded px-4 py-2 bg-gray-100 text-gray-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Phone cannot be changed</p>
                </div>
                <button
                  onClick={handleUpdateProfile}
                  disabled={saving}
                  className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:bg-gray-400 transition"
                >
                  {saving ? 'Saving...' : 'Update Profile'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bus Details Modal */}
      {selectedBus && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4">🚌 Bus Details</h3>
            <div className="space-y-3 mb-6">
              <p><strong>Bus Number:</strong> {selectedBus.busNumber}</p>
              <p><strong>Route:</strong> {selectedBus.route?.name}</p>
              <p><strong>Driver:</strong> {selectedBus.driver?.name}</p>
              <p><strong>Driver Phone:</strong> {selectedBus.driver?.phone}</p>
              <p><strong>Departure:</strong> {selectedBus.departureTime}</p>
              <p><strong>Capacity:</strong> {selectedBus.capacity} seats</p>
              <div className="bg-gray-50 p-3 rounded mt-2">
                <strong>Route Details:</strong>
                <p className="text-gray-600 mt-1">{selectedBus.route?.routeDetails}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedBus(null)}
              className="w-full bg-gray-600 text-white py-2 rounded hover:bg-gray-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentPage;

