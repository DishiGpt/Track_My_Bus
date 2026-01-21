import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { driverAPI, busAPI } from '../utils/api';

const DriverPage = () => {
  const { user, logout } = useAuth();
  const [bus, setBus] = useState(null);
  const [language, setLanguage] = useState('en');
  const [gpsEnabled, setGpsEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('bus');
  const locationInterval = useRef(null);

  const tabs = [
    { id: 'bus', label: language === 'en' ? 'My Bus' : 'मेरी बस', icon: '🚌' },
    { id: 'route', label: language === 'en' ? 'Route' : 'मार्ग', icon: '🛤️' },
    { id: 'gps', label: 'GPS', icon: '📍' },
    { id: 'settings', label: language === 'en' ? 'Settings' : 'सेटिंग्स', icon: '⚙️' },
  ];

  useEffect(() => {
    fetchAssignedBus();
  }, []);

  useEffect(() => {
    if (gpsEnabled) {
      startLocationTracking();
    } else {
      stopLocationTracking();
    }
    return () => stopLocationTracking();
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
    locationInterval.current = setInterval(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            try {
              await busAPI.updateLocation(latitude, longitude);
              console.log('Location updated:', latitude, longitude);
            } catch (error) {
              console.error('Error updating location:', error);
            }
          },
          (error) => console.error('Geolocation error:', error)
        );
      }
    }, 10000);
  };

  const stopLocationTracking = () => {
    if (locationInterval.current) {
      clearInterval(locationInterval.current);
      locationInterval.current = null;
    }
  };

  const translations = {
    en: {
      title: 'Driver Dashboard',
      busInfo: 'Bus Information',
      noBus: 'No bus assigned',
      busNumber: 'Bus Number',
      route: 'Route',
      departure: 'Departure Time',
      capacity: 'Capacity',
      coordinator: 'Coordinator',
      routeDetails: 'Route Details',
      waypoints: 'Stops',
      gpsTitle: 'GPS Location Sharing',
      gpsOn: 'GPS is ON - Sharing location every 10 seconds',
      gpsOff: 'GPS is OFF - Students cannot track your bus',
      start: 'START SHARING',
      stop: 'STOP SHARING',
      language: 'Language',
      logout: 'Logout',
    },
    hi: {
      title: 'ड्राइवर डैशबोर्ड',
      busInfo: 'बस की जानकारी',
      noBus: 'कोई बस असाइन नहीं',
      busNumber: 'बस नंबर',
      route: 'मार्ग',
      departure: 'प्रस्थान का समय',
      capacity: 'क्षमता',
      coordinator: 'कोऑर्डिनेटर',
      routeDetails: 'मार्ग विवरण',
      waypoints: 'स्टॉप',
      gpsTitle: 'GPS स्थान साझाकरण',
      gpsOn: 'GPS चालू है - हर 10 सेकंड में स्थान साझा कर रहा है',
      gpsOff: 'GPS बंद है - छात्र आपकी बस को ट्रैक नहीं कर सकते',
      start: 'साझा करना शुरू करें',
      stop: 'साझा करना बंद करें',
      language: 'भाषा',
      logout: 'लॉगआउट',
    },
  };

  const t = translations[language];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-green-600 text-white p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">🚗 {t.title}</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="bg-green-700 px-4 py-2 rounded hover:bg-green-800 transition"
            >
              {language === 'en' ? 'हिंदी' : 'English'}
            </button>
            <span className="text-sm bg-green-700 px-3 py-1 rounded-full">
              {user?.name} (Driver)
            </span>
            <button
              onClick={logout}
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition"
            >
              {t.logout}
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-4">
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-6 bg-white p-3 rounded-lg shadow">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition ${activeTab === tab.id
                ? 'bg-green-600 text-white shadow-lg'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : !bus ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-xl text-gray-600">{t.noBus}</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-6">
            {/* Bus Tab */}
            {activeTab === 'bus' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">{t.busInfo}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600">{t.busNumber}</p>
                    <p className="text-2xl font-bold">{bus.busNumber}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600">{t.route}</p>
                    <p className="text-2xl font-bold">{bus.route?.name}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600">{t.departure}</p>
                    <p className="text-2xl font-bold">{bus.departureTime}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600">{t.capacity}</p>
                    <p className="text-2xl font-bold">{bus.capacity} seats</p>
                  </div>
                </div>
              </div>
            )}

            {/* Route Tab */}
            {activeTab === 'route' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">{t.routeDetails}</h2>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="text-gray-600 mb-2">Starting Point:</p>
                  <p className="text-xl font-bold mb-4">{bus.route?.startingPoint}</p>
                  <p className="text-gray-600 mb-2">Route Details:</p>
                  <p className="text-lg">{bus.route?.routeDetails || 'No details available'}</p>
                </div>
                {bus.route?.waypoints?.length > 0 && (
                  <>
                    <h3 className="text-xl font-bold mb-3">{t.waypoints}</h3>
                    <div className="space-y-2">
                      {bus.route.waypoints.map((wp, index) => (
                        <div key={index} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                          <span className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                            {wp.order || index + 1}
                          </span>
                          <span className="font-medium">{wp.name}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* GPS Tab */}
            {activeTab === 'gps' && (
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-6">{t.gpsTitle}</h2>
                <div className={`p-6 rounded-lg mb-6 ${gpsEnabled ? 'bg-green-100 border-2 border-green-500' : 'bg-gray-100'}`}>
                  <p className="text-lg mb-4">
                    {gpsEnabled ? t.gpsOn : t.gpsOff}
                  </p>
                  <button
                    onClick={() => setGpsEnabled(!gpsEnabled)}
                    className={`px-8 py-4 rounded-lg text-white font-bold text-xl transition ${gpsEnabled
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-green-600 hover:bg-green-700'
                      }`}
                  >
                    {gpsEnabled ? t.stop : t.start}
                  </button>
                </div>
                {gpsEnabled && (
                  <div className="animate-pulse text-green-600">
                    📍 Sharing location...
                  </div>
                )}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="max-w-md">
                <h2 className="text-2xl font-bold mb-4">{t.language}</h2>
                <div className="flex gap-4">
                  <button
                    onClick={() => setLanguage('en')}
                    className={`flex-1 py-3 rounded-lg font-bold transition ${language === 'en' ? 'bg-green-600 text-white' : 'bg-gray-200'
                      }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => setLanguage('hi')}
                    className={`flex-1 py-3 rounded-lg font-bold transition ${language === 'hi' ? 'bg-green-600 text-white' : 'bg-gray-200'
                      }`}
                  >
                    हिंदी
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverPage;

