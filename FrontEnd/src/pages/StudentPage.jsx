import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import BusTracker from '../components/student/BusTracker';

const StudentPage = () => {
  const { user, logout, updateProfile, requestOTP } = useAuth();
  const [buses, setBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('buses');
  const [profileData, setProfileData] = useState({ name: '', phone: '' });
  const [saving, setSaving] = useState(false);
  const [phoneChangeStep, setPhoneChangeStep] = useState(0); // 0: normal, 1: enter new phone, 2: verify OTP
  const [newPhone, setNewPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const tabs = [
    { id: 'buses', label: 'Available Buses', icon: '🚌' },
    { id: 'track', label: 'Track Bus', icon: '📍' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  // --- Effects ---

  useEffect(() => {
    fetchBuses();
  }, []);

  useEffect(() => {
    if (user) {
      setProfileData({ name: user.name || '', phone: user.phone || '' });
    }
  }, [user]);

  // --- Logic: Data Fetching (From File 1) ---

  const fetchBuses = async () => {
    setLoading(true);
    try {
      // Mock data for demonstration
      setBuses([
        { 
          _id: '1', 
          busNumber: '12', 
          route: { name: 'Tekari Bus Stand' }, 
          departureTime: '08:00 AM', 
          driver: { name: 'Ram Singh', phone: '9876543210' },
          capacity: 40,
          currentLocation: { lat: 25.5941, lng: 85.1376 }
        },
        { 
          _id: '2', 
          busNumber: '10', 
          route: { name: 'Purana Kesla' }, 
          departureTime: '08:30 AM', 
          driver: { name: 'Mohan Lal', phone: '9876543211' },
          capacity: 35,
          currentLocation: { lat: 25.6041, lng: 85.1476 }
        },
        { 
          _id: '3', 
          busNumber: '15', 
          route: { name: 'Main Campus' }, 
          departureTime: '09:00 AM', 
          driver: { name: 'Suresh Kumar', phone: '9876543212' },
          capacity: 45,
          currentLocation: { lat: 25.5841, lng: 85.1276 }
        }
      ]);
    } catch (error) {
      console.error('Error fetching buses:', error);
    } finally {
      setLoading(false);
    }
  };

  // --- Logic: Settings & OTP (From File 2) ---

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

  const handlePhoneChangeRequest = async () => {
    if (!newPhone || newPhone.length !== 10) {
      setPhoneError('Please enter a valid 10-digit phone number');
      return;
    }
    setPhoneError('');
    setSaving(true);
    try {
      const result = await requestOTP(newPhone, 'phone-change');
      if (result.success) {
        setPhoneChangeStep(2);
        setPhoneError('');
      } else {
        setPhoneError(result.message || 'Failed to send OTP');
      }
    } catch (error) {
      setPhoneError('Failed to send OTP. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handlePhoneChangeVerify = async () => {
    if (!otp || otp.length !== 6) {
      setPhoneError('Please enter a valid 6-digit OTP');
      return;
    }
    setPhoneError('');
    setSaving(true);
    try {
      // Simulate API verification for now (or replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProfileData({ ...profileData, phone: newPhone });
      setPhoneChangeStep(0);
      setNewPhone('');
      setOtp('');
      alert('Phone number updated successfully!');
    } catch (error) {
      setPhoneError('Failed to verify OTP. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const cancelPhoneChange = () => {
    setPhoneChangeStep(0);
    setNewPhone('');
    setOtp('');
    setPhoneError('');
  };

  // --- Render ---

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
        {/* Tab Navigation - UI from File 2 */}
        <div className="flex flex-wrap gap-2 mb-6 bg-white p-3 rounded-lg shadow">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow p-6">
          
          {/* 1. BUSES TAB - UI from File 2, Data from API */}
          {activeTab === 'buses' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Available Buses Today</h2>
              {loading ? (
                <div className="flex justify-center p-8"><span className="animate-spin text-2xl">⌛</span> Loading buses...</div>
              ) : buses.length === 0 ? (
                <p className="text-gray-600">No buses available today</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {buses.map((bus) => (
                    <div key={bus._id} className="bg-gray-50 p-4 rounded-lg border hover:shadow-lg transition">
                      <h3 className="font-bold text-lg mb-2">🚌 {bus.busNumber}</h3>
                      <p className="text-gray-600">📍 Route: {bus.route?.name || 'N/A'}</p>
                      <p className="text-gray-600">⏰ Departure: {bus.departureTime}</p>
                      <p className="text-gray-600">👤 Driver: {bus.driver?.name || 'Assigned'}</p>
                      <p className="text-gray-600">🪑 Capacity: {bus.capacity} seats</p>
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

          {/* 2. TRACK TAB - Integrated BusTracker from File 1 */}
          {activeTab === 'track' && (
            <div className="h-[600px] w-full">
               <h2 className="text-2xl font-bold mb-4">Live Tracking</h2>
               {/* This injects the map functionality from File 1 */}
               <BusTracker buses={buses} />
            </div>
          )}

          {/* 3. SETTINGS TAB - UI & Logic from File 2 */}
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
                    className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Phone Number</label>
                  {phoneChangeStep === 0 && (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={profileData.phone}
                        disabled
                        className="w-full border rounded px-4 py-2 bg-gray-100 text-gray-500"
                      />
                      <button
                        onClick={() => setPhoneChangeStep(1)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Change Phone Number
                      </button>
                    </div>
                  )}

                  {phoneChangeStep === 1 && (
                    <div className="space-y-3">
                      <input
                        type="tel"
                        placeholder="Enter new 10-digit phone number"
                        value={newPhone}
                        onChange={(e) => setNewPhone(e.target.value)}
                        maxLength="10"
                        className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {phoneError && <p className="text-red-600 text-sm">{phoneError}</p>}
                      <div className="flex gap-2">
                        <button
                          onClick={handlePhoneChangeRequest}
                          disabled={saving}
                          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 transition"
                        >
                          {saving ? 'Sending OTP...' : 'Send OTP'}
                        </button>
                        <button
                          onClick={cancelPhoneChange}
                          className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-50 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {phoneChangeStep === 2 && (
                    <div className="space-y-3">
                      <div className="bg-blue-50 p-3 rounded text-center">
                        <p className="text-sm text-gray-600">
                          OTP sent to {newPhone}
                        </p>
                      </div>
                      <input
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        maxLength="6"
                        className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-2xl tracking-widest"
                      />
                      {phoneError && <p className="text-red-600 text-sm">{phoneError}</p>}
                      <div className="flex gap-2">
                        <button
                          onClick={handlePhoneChangeVerify}
                          disabled={saving}
                          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400 transition"
                        >
                          {saving ? 'Verifying...' : 'Verify & Update'}
                        </button>
                        <button
                          onClick={cancelPhoneChange}
                          className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-50 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Role</label>
                  <input
                    type="text"
                    value="Student"
                    disabled
                    className="w-full border rounded px-4 py-2 bg-gray-100 text-gray-500"
                  />
                </div>

                {phoneChangeStep === 0 && (
                  <button
                    onClick={handleUpdateProfile}
                    disabled={saving}
                    className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:bg-gray-400 transition"
                  >
                    {saving ? 'Saving...' : 'Update Profile'}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bus Details Modal - UI from File 2 */}
      {selectedBus && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4">🚌 Bus Details</h3>
            <div className="space-y-3 mb-6">
              <p><strong>Bus Number:</strong> {selectedBus.busNumber}</p>
              <p><strong>Route:</strong> {selectedBus.route?.name || 'N/A'}</p>
              <p><strong>Driver:</strong> {selectedBus.driver?.name || 'N/A'}</p>
              <p><strong>Driver Phone:</strong> {selectedBus.driver?.phone || 'N/A'}</p>
              <p><strong>Departure:</strong> {selectedBus.departureTime}</p>
              <p><strong>Capacity:</strong> {selectedBus.capacity} seats</p>
              <div className="bg-gray-50 p-3 rounded mt-2">
                <strong>Tracking Status:</strong>
                <p className="text-gray-600 mt-1">
                  {selectedBus.currentLocation 
                    ? '✅ Live tracking is available for this bus' 
                    : '❌ Live tracking is currently unavailable'
                  }
                </p>
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