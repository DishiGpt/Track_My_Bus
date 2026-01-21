// src/components/admin/AdminAnalytics.jsx
import React, { useEffect, useState } from 'react';
import api from '../../utils/api';

const AdminAnalytics = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/admin/analytics').then((res) => {
      if (res.data.success) setStats(res.data.data);
    });
  }, []);

  if (!stats) return <p>Loading analytics...</p>;

  const cards = [
    { label: 'Students', value: stats.students },
    { label: 'Drivers', value: stats.drivers },
    { label: 'Coordinators', value: stats.coordinators },
    { label: 'Buses', value: stats.buses },
    { label: 'Routes', value: stats.routes },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-4">
      {cards.map((c) => (
        <div key={c.label} className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">{c.label}</p>
          <p className="text-3xl font-bold mt-2">{c.value}</p>
        </div>
      ))}
    </div>
  );
};

export default AdminAnalytics;
