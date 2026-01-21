// src/pages/StudentPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { busAPI } from '../utils/api';
import StudentHome from '../components/student/StudentHome';
import BusTracker from '../components/student/BusTracker';
import BusDetails from '../components/student/BusDetails';
import StudentSettings from '../components/student/StudentSettings';

const StudentPage = () => {
  const { user, logout } = useAuth();
  const [buses, setBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('buses');
  const [language, setLanguage] = useState('en');

  const translations = {
    en: {
      title: 'Track My Bus',
      buses: 'Available Buses',
      track: 'Track Bus',
      settings: 'Settings',
      logout: 'Logout',
    },
    hi: {
      title: 'मेरी बस ट्रैक करें',
      buses: 'उपलब्ध बसें',
      track: 'बस ट्रैक करें',
      settings: 'सेटिंग्स',
      logout: 'लॉगआउट',
    },
  };

  const t = translations[language];

  const tabs = [
    { id: 'buses', label: t.buses, icon: '🚌' },
    { id: 'track', label: t.track, icon: '📍' },
    { id: 'settings', label: t.settings, icon: '⚙️' },
  ];

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
          <h1 className="text-2xl font-bold">🚌 {t.title}</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="bg-blue-700 px-4 py-2 rounded hover:bg-blue-800 transition"
            >
              {language === 'en' ? 'हिंदी' : 'English'}
            </button>
            <span className="text-sm bg-blue-700 px-3 py-1 rounded-full">
              {user?.name} (Student)
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
          {activeTab === 'buses' && (
            <StudentHome
              buses={buses}
              loading={loading}
              onSelectBus={setSelectedBus}
            />
          )}

          {activeTab === 'track' && <BusTracker buses={buses} />}

          {activeTab === 'settings' && <StudentSettings />}
        </div>
      </div>

      {/* Bus Details Modal */}
      <BusDetails bus={selectedBus} onClose={() => setSelectedBus(null)} />
    </div>
  );
};

export default StudentPage;
