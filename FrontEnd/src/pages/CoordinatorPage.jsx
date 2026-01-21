// src/pages/CoordinatorPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import BusManagement from '../components/coordinator/BusManagement';
import DriverManagement from '../components/coordinator/DriverManagement';
import RouteManagement from '../components/coordinator/RouteManagement';

const CoordinatorPage = () => {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState('buses');
  const [language, setLanguage] = useState('en');

  const translations = {
    en: {
      title: 'Coordinator Dashboard',
      buses: 'Buses',
      drivers: 'Drivers',
      routes: 'Routes',
      logout: 'Logout',
    },
    hi: {
      title: 'कोऑर्डिनेटर डैशबोर्ड',
      buses: 'बसें',
      drivers: 'ड्राइवर',
      routes: 'मार्ग',
      logout: 'लॉगआउट',
    },
  };

  const t = translations[language];

  const tabs = [
    { id: 'buses', label: t.buses, icon: '🚌' },
    { id: 'drivers', label: t.drivers, icon: '🚗' },
    { id: 'routes', label: t.routes, icon: '🛤️' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-600 text-white p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">👔 {t.title}</h1>
          <div className="flex gap-4 items-center">
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="bg-blue-700 px-4 py-2 rounded hover:bg-blue-800 transition"
            >
              {language === 'en' ? 'हिंदी' : 'English'}
            </button>
            <span className="text-sm bg-blue-700 px-3 py-1 rounded-full">
              {user?.name} (Coordinator)
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
          {tabs.map((tabItem) => (
            <button
              key={tabItem.id}
              onClick={() => setTab(tabItem.id)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition ${tab === tabItem.id
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
            >
              <span>{tabItem.icon}</span>
              <span>{tabItem.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow p-6">
          {tab === 'buses' && <BusManagement />}
          {tab === 'drivers' && <DriverManagement />}
          {tab === 'routes' && <RouteManagement />}
        </div>
      </div>
    </div>
  );
};

export default CoordinatorPage;
