import React, { useState, useEffect } from 'react';
import { UserRole } from '../types';
import { Header, Card, Button } from './Shared';
import api from '../src/api/axios';

export const AdminView = ({ onLogout }) => {
   const [activeTab, setActiveTab] = useState('home');
   const [showAddForm, setShowAddForm] = useState(false);
   const [analytics, setAnalytics] = useState({ students: 0, drivers: 0, buses: 0, activeBuses: 0 });
   const [coordinators, setCoordinators] = useState([]);
   const [buses, setBuses] = useState([]); // Simplified bus view
   const [message, setMessage] = useState('');

   // Form State
   const [fName, setFName] = useState('');
   const [fPhone, setFPhone] = useState('');

   const fetchAnalytics = async () => {
      try {
         const res = await api.get('/admin/analytics');
         setAnalytics(res.data);
      } catch (err) { console.error(err); }
   };

   const fetchCoordinators = async () => {
      try {
         const res = await api.get('/admin/coordinators');
         setCoordinators(res.data);
      } catch (err) { console.error(err); }
   };

   const fetchBuses = async () => {
      try {
         const res = await api.get('/coordinator/buses'); // Admin can reuse
         setBuses(res.data);
      } catch (err) { console.error(err); }
   };

   useEffect(() => {
      if (activeTab === 'home') fetchAnalytics();
      if (activeTab === 'coordinators') fetchCoordinators();
      if (activeTab === 'buses') fetchBuses();
   }, [activeTab]);

   const handleAddCoordinator = async (e) => {
      e.preventDefault();
      try {
         await api.post('/admin/coordinator', { name: fName, phoneNumber: fPhone });
         alert("Coordinator Added");
         setFName(''); setFPhone('');
         setShowAddForm(false);
         fetchCoordinators();
      } catch (err) {
         alert("Error adding coordinator");
      }
   };

   const handleBroadcast = async () => {
      try {
         await api.post('/admin/broadcast', { message, audience: 'ALL' });
         alert("Broadcast Sent!");
         setMessage('');
      } catch (err) { alert("Error sending broadcast"); }
   };

   const tabs = [
      { id: 'home', label: 'Home' },
      { id: 'buses', label: 'Buses' },
      { id: 'coordinators', label: 'Coordinators' },
   ];

   return (
      <div className="min-h-screen bg-[#F8F9FA] text-black">
         <Header title="Super Admin Dashboard" subtitle="System Control Panel" onLogout={onLogout} />

         <div className="flex bg-white shadow-sm border-b-2 border-black overflow-x-auto sticky top-[64px] z-40">
            {tabs.map(tab => (
               <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-8 py-4 text-[10px] font-black uppercase tracking-widest transition-all border-b-4 ${activeTab === tab.id ? 'border-black text-black bg-white' : 'border-transparent text-gray-400'}`}
               >
                  {tab.label}
               </button>
            ))}
         </div>

         <div className="p-4 space-y-6">
            {activeTab === 'home' && (
               <div className="space-y-6 animate-in fade-in duration-500 pb-10">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                     <div className="bg-black text-white p-5 rounded-[24px] shadow-xl">
                        <p className="text-3xl font-black">{analytics.buses}</p>
                        <p className="text-[10px] font-bold opacity-60 uppercase">Total Buses</p>
                     </div>
                     <div className="bg-white border-2 border-black p-5 rounded-[24px] shadow-md">
                        <p className="text-3xl font-black">{analytics.activeBuses}</p>
                        <p className="text-[10px] font-bold text-green-600 uppercase">Live Buses</p>
                     </div>
                     <div className="bg-white border-2 border-black p-5 rounded-[24px] shadow-md">
                        <p className="text-3xl font-black">{analytics.students}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Students</p>
                     </div>
                     <div className="bg-white border-2 border-black p-5 rounded-[24px] shadow-md">
                        <p className="text-3xl font-black">{analytics.drivers}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Drivers</p>
                     </div>
                  </div>

                  <Card className="p-6 bg-white border-2 border-black shadow-lg">
                     <h3 className="font-black uppercase text-sm tracking-widest mb-4">Broadcast Message</h3>
                     <textarea
                        className="w-full p-4 border border-black rounded-xl mb-4"
                        placeholder="Type message for all users..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                     />
                     <Button onClick={handleBroadcast} className="bg-black text-white py-3 shadow-lg">Send Notification</Button>
                  </Card>
               </div>
            )}

            {activeTab === 'coordinators' && (
               <div className="space-y-4 pb-20">
                  <div className="flex justify-between items-center bg-white p-5 rounded-[28px] border-2 border-black shadow-lg">
                     <h3 className="font-black text-black uppercase text-sm tracking-widest">Coordinators</h3>
                     <button onClick={() => setShowAddForm(true)} className="bg-black text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase shadow-xl hover:scale-105 active:scale-95 transition-all">+ Add New</button>
                  </div>

                  {showAddForm && (
                     <Card className="p-8 bg-white border-4 border-black shadow-2xl rounded-[32px] animate-in slide-in-from-top-4">
                        <form onSubmit={handleAddCoordinator} className="space-y-4">
                           <input required value={fName} onChange={(e) => setFName(e.target.value)} placeholder="Name" className="w-full p-5 bg-gray-50 border-2 border-black rounded-3xl font-black text-black outline-none" />
                           <input required value={fPhone} onChange={(e) => setFPhone(e.target.value)} placeholder="Phone" className="w-full p-5 bg-gray-50 border-2 border-black rounded-3xl font-black text-black outline-none" />
                           <Button type="submit" className="bg-black text-white py-5 mt-4 text-xl tracking-widest shadow-xl border-b-4 border-gray-900">Add Coordinator</Button>
                        </form>
                     </Card>
                  )}

                  <div className="space-y-3">
                     {coordinators.map(c => (
                        <Card key={c._id} className="p-5 flex justify-between items-center bg-white border-2 border-black shadow-md">
                           <div>
                              <p className="font-black text-black text-lg">{c.name}</p>
                              <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{c.phoneNumber}</p>
                           </div>
                        </Card>
                     ))}
                  </div>
               </div>
            )}

            {activeTab === 'buses' && (
               <div className="space-y-4">
                  {buses.map(bus => (
                     <Card key={bus._id} className="p-4 bg-white border-2 border-black shadow-md">
                        <p className="font-black">Bus {bus.busNumber}</p>
                        <p className="text-xs text-gray-500">{bus.route}</p>
                     </Card>
                  ))}
               </div>
            )}
         </div>
      </div>
   );
};
