import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { driverAPI } from '../utils/api'; // Used File 2's API for real data
import locationService from '../utils/locationService'; // functionality from File 1 & 2

const DriverPage = () => {
  const { user, logout } = useAuth();
  
  // State Management
  const [bus, setBus] = useState(null);
  const [language, setLanguage] = useState('en'); // Defaulting to English, adjustable via UI
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('bus');
  
  // GPS Tracking State
  const [gpsEnabled, setGpsEnabled] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [lastUpdateTime, setLastUpdateTime] = useState(null);

  // Translations (Merged for completeness)
  const translations = {
    en: {
      title: 'Driver Dashboard',
      busInfo: 'Bus Information',
      noBus: 'No bus assigned',
      busNumber: 'Bus Number',
      route: 'Route',
      departure: 'Departure Time',
      capacity: 'Capacity',
      routeDetails: 'Route Details',
      waypoints: 'Stops',
      gpsTitle: 'GPS Location Sharing',
      gpsOn: 'GPS is ON - Location shared every 10 seconds',
      gpsOff: 'GPS is OFF - Students cannot track your bus',
      start: 'START SHARING',
      stop: 'STOP SHARING',
      language: 'Language',
      logout: 'Logout',
      currentLocation: 'Current Location',
      lastUpdate: 'Last Update',
      accuracy: 'Accuracy',
      startingPoint: 'Starting Point',
      sharingLocation: 'Sharing location...',
      gettingLocation: 'Getting location...'
    },
    hi: {
      title: 'ड्राइवर डैशबोर्ड',
      busInfo: 'बस की जानकारी',
      noBus: 'कोई बस असाइन नहीं',
      busNumber: 'बस नंबर',
      route: 'मार्ग',
      departure: 'प्रस्थान का समय',
      capacity: 'क्षमता',
      routeDetails: 'मार्ग विवरण',
      waypoints: 'स्टॉप',
      gpsTitle: 'GPS स्थान साझाकरण',
      gpsOn: 'GPS चालू है - हर 10 सेकंड में स्थान साझा',
      gpsOff: 'GPS बंद है - छात्र आपकी बस को ट्रैक नहीं कर सकते',
      start: 'शुरू करें',
      stop: 'बंद करें',
      language: 'भाषा',
      logout: 'लॉगआउट',
      currentLocation: 'वर्तमान स्थान',
      lastUpdate: 'अंतिम अपडेट',
      accuracy: 'सटीकता',
      startingPoint: 'शुरुआती बिंदु',
      sharingLocation: 'स्थान साझा कर रहा है...',
      gettingLocation: 'स्थान प्राप्त कर रहा है...'
    },
  };

  const t = translations[language];

  const tabs = [
    { id: 'bus', label: language === 'en' ? 'My Bus' : 'मेरी बस', icon: '🚌' },
    { id: 'route', label: language === 'en' ? 'Route' : 'मार्ग', icon: '🛤️' },
    { id: 'gps', label: 'GPS', icon: '📍' },
    { id: 'settings', label: language === 'en' ? 'Settings' : 'सेटिंग्स', icon: '⚙️' },
  ];

  // --- Effects ---

  useEffect(() => {
    fetchAssignedBus();
  }, []); // Fetch on mount

  // Handle GPS tracking toggles
  useEffect(() => {
    if (gpsEnabled) {
      startTracking();
    } else {
      stopTracking();
    }

    return () => {
      locationService.stopTracking();
    };
  }, [gpsEnabled]);

  // --- Logic ---

  // 1. Data Fetching (Using API from File 2)
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

  // 2. GPS Logic (Shared logic)
  const startTracking = async () => {
    setLocationError(null);
    await locationService.startTracking(
      (location) => {
        setCurrentLocation(location);
        setLastUpdateTime(new Date());
      },
      (error) => {
        setLocationError(error);
        console.error('Location error:', error);
      }
    );
  };

  const stopTracking = async () => {
    await locationService.stopTracking();
    setCurrentLocation(null);
    setLastUpdateTime(null);
  };

  const handleGpsToggle = async () => {
    if (!gpsEnabled) {
      const hasPermission = await locationService.requestPermissions();
      if (!hasPermission) {
        setLocationError('Location permission denied. Please enable in settings.');
        return;
      }
    }
    setGpsEnabled(!gpsEnabled);
  };

  // --- Render ---

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar - Using File 2 style (includes Language Toggle) */}
      <nav className="bg-green-600 text-white p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">🚗 {t.title}</h1>
          <div className="flex items-center gap-4">
            {/* GPS Status Indicator */}
            {gpsEnabled && (
              <span className="flex items-center gap-1 text-sm bg-green-700 px-3 py-1 rounded-full animate-pulse">
                <span className="w-2 h-2 bg-green-300 rounded-full"></span>
                GPS Active
              </span>
            )}
            
            {/* Navbar Language Toggle */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="bg-green-700 px-4 py-2 rounded hover:bg-green-800 transition"
            >
              {language === 'en' ? 'हिंदी' : 'English'}
            </button>
            
            <span className="text-sm bg-green-700 px-3 py-1 rounded-full hidden sm:inline-block">
              {user?.name} ({language === 'en' ? 'Driver' : 'ड्राइवर'})
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

        {/* Content Area */}
        {loading ? (
          <p className="text-center text-gray-600 mt-8">Loading...</p>
        ) : !bus ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-xl text-gray-600">{t.noBus}</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-6">
            
            {/* BUS INFO TAB */}
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
                    <p className="text-2xl font-bold">{bus.capacity} {language === 'hi' ? 'सीटें' : 'seats'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* ROUTE TAB */}
            {activeTab === 'route' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">{t.routeDetails}</h2>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="text-gray-600 mb-2">{t.startingPoint}:</p>
                  <p className="text-xl font-bold mb-4">{bus.route?.startingPoint || 'N/A'}</p>
                  <p className="text-gray-600 mb-2">{t.routeDetails}:</p>
                  <p className="text-lg">{bus.route?.routeDetails || (language === 'hi' ? 'कोई विवरण उपलब्ध नहीं' : 'No details available')}</p>
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

            {/* GPS TAB - Using detailed stats from File 1 */}
            {activeTab === 'gps' && (
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-6">{t.gpsTitle}</h2>

                {locationError && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {locationError}
                  </div>
                )}

                <div className={`p-6 rounded-lg mb-6 transition-colors ${gpsEnabled ? 'bg-green-100 border-2 border-green-500' : 'bg-gray-100'}`}>
                  <p className="text-lg mb-4">
                    {gpsEnabled ? t.gpsOn : t.gpsOff}
                  </p>
                  <button
                    onClick={handleGpsToggle}
                    className={`px-8 py-4 rounded-lg text-white font-bold text-xl transition ${gpsEnabled
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-green-600 hover:bg-green-700'
                      }`}
                  >
                    {gpsEnabled ? t.stop : t.start}
                  </button>
                </div>

                {gpsEnabled && currentLocation && (
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                      <span className="text-green-700 font-semibold">Live Tracking Active</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">{t.currentLocation}</p>
                        <p className="font-mono font-medium">
                          {currentLocation.latitude?.toFixed(6)}, {currentLocation.longitude?.toFixed(6)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">{t.accuracy}</p>
                        <p className="font-medium">±{currentLocation.accuracy?.toFixed(0)}m</p>
                      </div>
                      <div>
                        <p className="text-gray-600">{t.lastUpdate}</p>
                        <p className="font-medium">
                          {lastUpdateTime?.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {gpsEnabled && !currentLocation && (
                  <div className="animate-pulse text-green-600 flex items-center justify-center gap-2">
                    <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                    {t.gettingLocation}
                  </div>
                )}
              </div>
            )}

            {/* SETTINGS TAB */}
            {activeTab === 'settings' && (
              <div className="max-w-md">
                <h2 className="text-2xl font-bold mb-4">{language === 'hi' ? 'सेटिंग्स' : 'Settings'}</h2>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600 mb-2">{language === 'hi' ? 'भाषा' : 'Language'}</p>
                    <p className="font-medium">{language === 'hi' ? 'हिंदी' : 'English'}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {language === 'hi' 
                        ? 'भाषा बदलने के लिए ऊपर बटन का उपयोग करें' 
                        : 'Use the button in the header to change language'
                      }
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600 mb-2">{language === 'hi' ? 'ड्राइवर जानकारी' : 'Driver Information'}</p>
                    <p className="font-medium">{user?.name}</p>
                    <p className="text-sm text-gray-500">{language === 'hi' ? 'ड्राइवर' : 'Driver'}</p>
                  </div>
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