import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { driverAPI, busAPI } from '../utils/api';

const DriverPage = () => {
  const { user, logout } = useAuth();
  const [bus, setBus] = useState(null);
  const [language, setLanguage] = useState('en');
  const [gpsEnabled, setGpsEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAssignedBus();
  }, []);

  useEffect(() => {
    if (gpsEnabled) {
      startLocationTracking();
    } else {
      stopLocationTracking();
    }
  }, [gpsEnabled]);

  const fetchAssignedBus = async () => {
    setLoading(true);
    try {
      const response = await driverAPI.getAssignedBus();
      if (response.data.success) {
        setBus(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching bus:', error);
    } finally {
      setLoading(false);
    }
  };

  const startLocationTracking = () => {
    const locationInterval = setInterval(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            try {
              await busAPI.updateLocation(latitude, longitude);
            } catch (error) {
              console.error('Error updating location:', error);
            }
          },
          (error) => console.error('Geolocation error:', error)
        );
      }
    }, 10000); // Every 10 seconds

    return () => clearInterval(locationInterval);
  };

  const stopLocationTracking = () => {
    // Clear interval
  };

  const translations = {
    en: {
      title: 'Driver Dashboard',
      busRoute: 'Bus Route',
      language: 'Language',
      gps: 'GPS Location Sharing',
      on: 'ON',
      off: 'OFF',
      busNumber: 'Bus Number',
      route: 'Route',
      departure: 'Departure Time',
      routeDetails: 'Route Details',
      logout: 'Logout',
    },
    hi: {
      title: 'ड्राइवर डैशबोर्ड',
      busRoute: 'बस मार्ग',
      language: 'भाषा',
      gps: 'GPS स्थान साझाकरण',
      on: 'चालू',
      off: 'बंद',
      busNumber: 'बस संख्या',
      route: 'मार्ग',
      departure: 'प्रस्थान का समय',
      routeDetails: 'मार्ग विवरण',
      logout: 'लॉगआउट',
    },
  };

  const t = translations[language];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-600 text-white p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">{t.title}</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="bg-blue-700 px-4 py-2 rounded hover:bg-blue-800"
            >
              {language === 'en' ? 'हिंदी' : 'English'}
            </button>
            <span>{user?.name}</span>
            <button
              onClick={logout}
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
            >
              {t.logout}
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-4">
        {loading ? (
          <p>Loading...</p>
        ) : bus ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-4">{t.busRoute}</h2>
              <div className="space-y-3">
                <p>
                  <strong>{t.busNumber}:</strong> {bus.busNumber}
                </p>
                <p>
                  <strong>{t.route}:</strong> {bus.route?.name}
                </p>
                <p>
                  <strong>{t.departure}:</strong> {bus.departureTime}
                </p>
                <div className="mt-4">
                  <strong>{t.routeDetails}:</strong>
                  <p className="text-gray-600 mt-2">{bus.route?.routeDetails}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-4">{t.gps}</h2>
              <div className="flex items-center justify-between mb-4">
                <span>{gpsEnabled ? t.on : t.off}</span>
                <button
                  onClick={() => setGpsEnabled(!gpsEnabled)}
                  className={`px-6 py-3 rounded text-white font-bold ${
                    gpsEnabled ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {gpsEnabled ? 'STOP' : 'START'}
                </button>
              </div>
              {gpsEnabled && (
                <div className="bg-green-50 border border-green-200 p-4 rounded">
                  <p className="text-sm text-green-700">
                    ✓ Sharing location every 10 seconds
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-600">No bus assigned</p>
        )}
      </div>
    </div>
  );
};

export default DriverPage;
