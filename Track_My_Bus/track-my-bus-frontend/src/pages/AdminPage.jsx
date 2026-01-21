// src/pages/AdminPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import AdminAnalytics from '../components/admin/AdminAnalytics';
import BroadcastNotification from '../components/admin/BroadcastNotification';
import StudentManagement from '../components/admin/StudentManagement';
import DriverManagement from '../components/admin/DriverManagement';
import CoordinatorManagement from '../components/admin/CoordinatorManagement';
import BusManagement from '../components/admin/BusManagement';
import RouteManagement from '../components/admin/RouteManagement';

const AdminPage = () => {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState('analytics');

  const tabs = [
    { id: 'analytics', label: 'Analytics', icon: '📊' },
    { id: 'students', label: 'Students', icon: '👨‍🎓' },
    { id: 'drivers', label: 'Drivers', icon: '🚗' },
    { id: 'coordinators', label: 'Coordinators', icon: '👔' },
    { id: 'buses', label: 'Buses', icon: '🚌' },
    { id: 'routes', label: 'Routes', icon: '🛤️' },
    { id: 'broadcast', label: 'Broadcast', icon: '📢' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-gray-900 text-white p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">🛡️ Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm bg-gray-700 px-3 py-1 rounded-full">
              {user?.name} (Admin)
            </span>
            <button
              onClick={logout}
              className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition"
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
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition ${tab === t.id
                  ? 'bg-gray-900 text-white shadow-lg'
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
          {tab === 'analytics' && <AdminAnalytics />}
          {tab === 'students' && <StudentManagement />}
          {tab === 'drivers' && <DriverManagement />}
          {tab === 'coordinators' && <CoordinatorManagement />}
          {tab === 'buses' && <BusManagement />}
          {tab === 'routes' && <RouteManagement />}
          {tab === 'broadcast' && <BroadcastNotification />}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;

