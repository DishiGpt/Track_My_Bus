import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { busAPI } from '../utils/api';

const StudentPage = () => {
  const { user, logout } = useAuth();
  const [buses, setBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('buses'); // buses or settings

  useEffect(() => {
    fetchBuses();
  }, []);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-600 text-white p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Track My Bus</h1>
          <div className="flex items-center gap-4">
            <span>{user?.name}</span>
            <button
              onClick={logout}
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-4">
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('buses')}
            className={`px-6 py-2 rounded ${
              activeTab === 'buses'
                ? 'bg-blue-600 text-white'
                : 'bg-white border'
            }`}
          >
            Available Buses
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-6 py-2 rounded ${
              activeTab === 'settings'
                ? 'bg-blue-600 text-white'
                : 'bg-white border'
            }`}
          >
            Settings
          </button>
        </div>

        {activeTab === 'buses' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Available Buses Today</h2>
            {loading ? (
              <p>Loading buses...</p>
            ) : buses.length === 0 ? (
              <p className="text-gray-600">No buses available today</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {buses.map((bus) => (
                  <div key={bus._id} className="bg-white p-4 rounded-lg shadow">
                    <h3 className="font-bold text-lg mb-2">
                      Bus #{bus.busNumber}
                    </h3>
                    <p className="text-gray-600">
                      Route: {bus.route?.name}
                    </p>
                    <p className="text-gray-600">
                      Departure: {bus.departureTime}
                    </p>
                    <p className="text-gray-600">
                      Driver: {bus.driver?.name}
                    </p>
                    <button
                      onClick={() => setSelectedBus(bus)}
                      className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                    >
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white p-6 rounded-lg shadow max-w-md">
            <h2 className="text-2xl font-bold mb-4">Profile Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Name
                </label>
                <input
                  type="text"
                  defaultValue={user?.name}
                  className="w-full border rounded px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  defaultValue={user?.email}
                  className="w-full border rounded px-4 py-2"
                />
              </div>
              <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
                Update Profile
              </button>
            </div>
          </div>
        )}
      </div>

      {selectedBus && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4">Bus Details</h3>
            <div className="space-y-3 mb-6">
              <p>
                <strong>Bus Number:</strong> {selectedBus.busNumber}
              </p>
              <p>
                <strong>Route:</strong> {selectedBus.route?.name}
              </p>
              <p>
                <strong>Driver:</strong> {selectedBus.driver?.name}
              </p>
              <p>
                <strong>Driver Phone:</strong> {selectedBus.driver?.phone}
              </p>
              <p>
                <strong>Departure:</strong> {selectedBus.departureTime}
              </p>
              <p>
                <strong>Route Details:</strong>{' '}
                {selectedBus.route?.routeDetails}
              </p>
            </div>
            <button
              onClick={() => setSelectedBus(null)}
              className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
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
