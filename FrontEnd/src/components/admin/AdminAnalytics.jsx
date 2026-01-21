// src/components/admin/AdminAnalytics.jsx
import React, { useEffect, useState } from 'react';
import api from '../../utils/api';

const AdminAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [liveBuses, setLiveBuses] = useState([
    { id: 10, driver: 'Mohan Lal', location: 'MOHANIA', status: 'ON ROUTE', route: 'GPS-ONLINE' },
    { id: 11, driver: 'Suresh Das', location: 'BIHTA', status: 'ON ROUTE', route: 'GPS-ONLINE' },
    { id: 12, driver: 'Vikram Singh', location: 'TEKARI', status: 'ON ROUTE', route: 'GPS-OFF' },
    { id: 13, driver: 'Abdul Khan', location: 'RAMPURA', status: 'ON ROUTE', route: 'GPS-OFF' },
  ]);

  useEffect(() => {
    // Mock comprehensive data - replace with actual API call
    setStats({
      buses: 4,
      activeNow: 4,
      students: 156,
      drivers: 12,
      coordinators: 8,
      routes: 15,
      alertsInactive: 0
    });
  }, []);

  if (!stats) return <p>Loading analytics...</p>;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Buses */}
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">TOTAL</p>
              <p className="text-3xl font-bold text-gray-900">{stats.buses}</p>
              <p className="text-xs text-gray-500 mt-1">BUSES REGISTERED</p>
            </div>
            <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Active Now */}
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">LIVE</p>
              <p className="text-3xl font-bold text-gray-900">{stats.activeNow}</p>
              <p className="text-xs text-gray-500 mt-1">ACTIVE NOW</p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Students */}
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900">{stats.students}</p>
              <p className="text-xs text-gray-500 mt-1">STUDENTS</p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-gray-600">
                <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H17c-.8 0-1.54.37-2.01.99l-2.98 3.67a.5.5 0 0 0 .39.84H14v7h6z"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Alerts */}
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900">{stats.alertsInactive}</p>
              <p className="text-xs text-gray-500 mt-1">ALERTS/INACTIVE</p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Drivers */}
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.drivers}</p>
              <p className="text-xs text-gray-500 mt-1">DRIVERS</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-blue-600">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Coordinators */}
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.coordinators}</p>
              <p className="text-xs text-gray-500 mt-1">COORDINATORS</p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-purple-600">
                <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H17c-.8 0-1.54.37-2.01.99l-2.98 3.67a.5.5 0 0 0 .39.84H14v7h6z"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Routes */}
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.routes}</p>
              <p className="text-xs text-gray-500 mt-1">ROUTES</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-green-600">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Live Bus Monitor */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">LIVE BUS MONITOR</h3>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">ON TIME</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-gray-600">DELAYED</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {liveBuses.map((bus) => (
            <div key={bus.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white font-bold">
                  {bus.id}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{bus.driver}</p>
                  <p className="text-sm text-gray-500">{bus.location}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                  {bus.status}
                </span>
                <p className="text-xs text-gray-500 mt-1">{bus.route}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
