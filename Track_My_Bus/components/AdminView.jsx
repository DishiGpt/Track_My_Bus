import React, { useState, useEffect } from 'react';
import { UserRole } from '../types';
import { Header, Card, Button } from './Shared';
import api from '../src/api/axios';

export const AdminView = ({ onLogout }) => {
   const [activeTab, setActiveTab] = useState('home');

   // Data State
   const [analytics, setAnalytics] = useState({ students: 0, drivers: 0, buses: 0, activeBuses: 0 });
   const [coordinators, setCoordinators] = useState([]);
   const [students, setStudents] = useState([]);
   const [drivers, setDrivers] = useState([]);
   const [routes, setRoutes] = useState([]);
   const [buses, setBuses] = useState([]);

   // UI State
   const [showAddForm, setShowAddForm] = useState(false);
   const [editMode, setEditMode] = useState(null); // null or Item ID
   const [message, setMessage] = useState('');

   // Forms State
   const [formData, setFormData] = useState({});

   useEffect(() => {
      fetchAnalytics();
   }, []);

   useEffect(() => {
      if (activeTab === 'home') fetchAnalytics();
      if (activeTab === 'coordinators') fetchCoordinators();
      if (activeTab === 'students') fetchStudents();
      if (activeTab === 'routes') fetchRoutes();
      if (activeTab === 'drivers') { fetchDrivers(); fetchBuses(); } // Need buses for driver assignment
   }, [activeTab]);

   // --- FETCHERS ---
   const fetchAnalytics = async () => { try { const res = await api.get('/admin/analytics'); setAnalytics(res.data); } catch (err) { console.error(err); } };
   const fetchCoordinators = async () => { try { const res = await api.get('/admin/coordinators'); setCoordinators(res.data); } catch (err) { console.error(err); } };
   const fetchStudents = async () => { try { const res = await api.get('/admin/students'); setStudents(res.data); } catch (err) { console.error(err); } };
   const fetchRoutes = async () => { try { const res = await api.get('/admin/routes'); setRoutes(res.data); } catch (err) { console.error(err); } };
   const fetchDrivers = async () => { try { const res = await api.get('/admin/drivers'); setDrivers(res.data); } catch (err) { console.error(err); } };
   const fetchBuses = async () => { try { const res = await api.get('/coordinator/buses'); setBuses(res.data); } catch (err) { console.error(err); } };

   // --- HANDLERS ---
   const resetForm = () => { setFormData({}); setEditMode(null); setShowAddForm(false); };

   // GENERIC DELETE
   const handleDelete = async (endpoint, id, refreshFn) => {
      if (!window.confirm("Are you sure?")) return;
      try {
         await api.delete(`${endpoint}/${id}`);
         refreshFn();
      } catch (err) { alert("Error deleting item"); }
   };

   // COORDINATOR HANDLERS
   const handleSaveCoordinator = async (e) => {
      e.preventDefault();
      try {
         await api.post('/admin/coordinator', { name: formData.name, phoneNumber: formData.phoneNumber });
         alert("Coordinator Added");
         resetForm(); fetchCoordinators();
      } catch (err) { alert(err.response?.data?.message || "Error saving coordinator"); }
   };

   // STUDENT HANDLERS
   const handleSaveStudent = async (e) => {
      e.preventDefault();
      try {
         if (editMode) {
            await api.put(`/admin/student/${editMode}`, formData);
            alert("Student Updated");
         } else {
            await api.post('/admin/student', formData);
            alert("Student Added");
         }
         resetForm(); fetchStudents();
      } catch (err) { alert(err.response?.data?.message || "Error saving student"); }
   };

   // ROUTE HANDLERS
   const handleSaveRoute = async (e) => {
      e.preventDefault();
      try {
         if (editMode) {
            await api.put(`/admin/route/${editMode}`, formData);
            alert("Route Updated");
         } else {
            await api.post('/admin/route', formData);
            alert("Route Added");
         }
         resetForm(); fetchRoutes();
      } catch (err) { alert(err.response?.data?.message || "Error saving route"); }
   };

   // DRIVER HANDLERS
   const handleSaveDriver = async (e) => {
      e.preventDefault();
      try {
         if (editMode) {
            await api.put(`/admin/driver/${editMode}`, formData);
            alert("Driver Updated");
         } else {
            await api.post('/admin/driver', formData);
            alert("Driver Added");
         }
         resetForm(); fetchDrivers();
      } catch (err) { alert(err.response?.data?.message || "Error saving driver"); }
   };


   // BUS HANDLERS
   const handleSaveBus = async (e) => {
      e.preventDefault();
      try {
         if (editMode) {
            await api.put(`/admin/bus/${editMode}`, formData);
            alert("Bus Updated");
         } else {
            await api.post('/admin/bus', formData);
            alert("Bus Added");
         }
         resetForm(); fetchBuses();
      } catch (err) { alert(err.response?.data?.message || "Error saving bus"); }
   };

   const handleBroadcast = async () => {
      try {
         await api.post('/admin/broadcast', { message, audience: 'ALL' });
         alert("Broadcast Sent!"); setMessage('');
      } catch (err) { alert("Error sending broadcast"); }
   };

   const tabs = [
      { id: 'home', label: 'Home' },
      { id: 'coordinators', label: 'Coordinators' },
      { id: 'students', label: 'Students' },
      { id: 'drivers', label: 'Drivers' },
      { id: 'routes', label: 'Routes' },
      { id: 'buses', label: 'Buses' },
   ];

   return (
      <div className="min-h-screen bg-[#F8F9FA] text-black">
         <Header title="Super Admin Dashboard" subtitle="System Control Panel" onLogout={onLogout} />

         <div className="flex bg-white shadow-sm border-b-2 border-black overflow-x-auto sticky top-[64px] z-40">
            {tabs.map(tab => (
               <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); resetForm(); }}
                  className={`px-6 py-4 text-[10px] font-black uppercase tracking-widest transition-all border-b-4 shrink-0 ${activeTab === tab.id ? 'border-black text-black bg-white' : 'border-transparent text-gray-400'}`}
               >
                  {tab.label}
               </button>
            ))}
         </div>

         <div className="p-4 space-y-6 pb-20">
            {/* --- HOME TAB --- */}
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

            {/* --- COORDINATORS TAB --- */}
            {activeTab === 'coordinators' && (
               <div className="space-y-4">
                  <div className="flex justify-between items-center bg-white p-5 rounded-[28px] border-2 border-black shadow-lg">
                     <h3 className="font-black text-black uppercase text-sm tracking-widest">Coordinators</h3>
                     <button onClick={() => setShowAddForm(true)} className="bg-black text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase shadow-xl hover:scale-105 active:scale-95 transition-all outline-none">+ Add</button>
                  </div>
                  {showAddForm && (
                     <Card className="p-8 bg-white border-4 border-black shadow-2xl rounded-[32px] animate-in slide-in-from-top-4">
                        <form onSubmit={handleSaveCoordinator} className="space-y-4">
                           <input required value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Name" className="w-full p-5 bg-gray-50 border-2 border-black rounded-3xl font-black text-black outline-none" />
                           <input required value={formData.phoneNumber || ''} onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} placeholder="Phone" className="w-full p-5 bg-gray-50 border-2 border-black rounded-3xl font-black text-black outline-none" />
                           <div className="flex gap-4">
                              <Button type="button" onClick={resetForm} className="flex-1 bg-gray-200 text-black py-4">Cancel</Button>
                              <Button type="submit" className="flex-1 bg-black text-white py-4 shadow-xl">Save</Button>
                           </div>
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
                           <div className="flex gap-2">
                              <button onClick={() => handleDelete('/admin/coordinator', c._id, fetchCoordinators)} className="text-xs font-bold text-red-600 underline">Delete</button>
                           </div>
                        </Card>
                     ))}
                  </div>
               </div>
            )}

            {/* --- STUDENTS TAB --- */}
            {activeTab === 'students' && (
               <div className="space-y-4">
                  <div className="flex justify-between items-center bg-white p-5 rounded-[28px] border-2 border-black shadow-lg">
                     <h3 className="font-black text-black uppercase text-sm tracking-widest">Students</h3>
                     <button onClick={() => { setShowAddForm(true); setFormData({}); }} className="bg-black text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase shadow-xl hover:scale-105 active:scale-95 transition-all outline-none">+ Add</button>
                  </div>

                  {showAddForm && (
                     <Card className="p-8 bg-white border-4 border-black shadow-2xl rounded-[32px] animate-in slide-in-from-top-4">
                        <h4 className="font-black mb-4 uppercase text-xs">{editMode ? 'Edit Student' : 'Add Student'}</h4>
                        <form onSubmit={handleSaveStudent} className="space-y-4">
                           <input required value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Name" className="w-full p-5 bg-gray-50 border-2 border-black rounded-3xl font-black text-black outline-none" />
                           <input required value={formData.email || ''} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="Email" className="w-full p-5 bg-gray-50 border-2 border-black rounded-3xl font-black text-black outline-none" />
                           <input required value={formData.phoneNumber || ''} onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} placeholder="Phone" className="w-full p-5 bg-gray-50 border-2 border-black rounded-3xl font-black text-black outline-none" />
                           <div className="flex gap-4">
                              <Button type="button" onClick={resetForm} className="flex-1 bg-gray-200 text-black py-4">Cancel</Button>
                              <Button type="submit" className="flex-1 bg-black text-white py-4 shadow-xl">Save</Button>
                           </div>
                        </form>
                     </Card>
                  )}

                  <div className="space-y-3">
                     {students.map(s => (
                        <Card key={s._id} className="p-5 flex justify-between items-center bg-white border-2 border-black shadow-md">
                           <div>
                              <p className="font-black text-black text-lg">{s.name}</p>
                              <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{s.email} | {s.phoneNumber}</p>
                              {s.otp && <p className="text-[10px] text-blue-500 font-mono mt-1">OTP: {s.otp}</p>}
                           </div>
                           <div className="flex gap-2">
                              <button onClick={() => { setEditMode(s._id); setFormData(s); setShowAddForm(true); }} className="text-xs font-bold underline">Edit</button>
                              <button onClick={() => handleDelete('/admin/student', s._id, fetchStudents)} className="text-xs font-bold text-red-600 underline">Delete</button>
                           </div>
                        </Card>
                     ))}
                  </div>
               </div>
            )}

            {/* --- ROUTES TAB --- */}
            {activeTab === 'routes' && (
               <div className="space-y-4">
                  <div className="flex justify-between items-center bg-white p-5 rounded-[28px] border-2 border-black shadow-lg">
                     <h3 className="font-black text-black uppercase text-sm tracking-widest">Bus Routes</h3>
                     <button onClick={() => { setShowAddForm(true); setFormData({}); }} className="bg-black text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase shadow-xl hover:scale-105 active:scale-95 transition-all outline-none">+ Add</button>
                  </div>

                  {showAddForm && (
                     <Card className="p-8 bg-white border-4 border-black shadow-2xl rounded-[32px] animate-in slide-in-from-top-4">
                        <h4 className="font-black mb-4 uppercase text-xs">{editMode ? 'Edit Route' : 'Add Route'}</h4>
                        <form onSubmit={handleSaveRoute} className="space-y-4">
                           <input required value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Route Name (e.g., Downtown-Campus)" className="w-full p-5 bg-gray-50 border-2 border-black rounded-3xl font-black text-black outline-none" />
                           <textarea required value={formData.rawRouteText || ''} onChange={(e) => setFormData({ ...formData, rawRouteText: e.target.value })} placeholder="Route Details (Stops, timings...)" className="w-full p-5 h-32 bg-gray-50 border-2 border-black rounded-3xl font-black text-black outline-none resize-none" />
                           <div className="flex gap-4">
                              <Button type="button" onClick={resetForm} className="flex-1 bg-gray-200 text-black py-4">Cancel</Button>
                              <Button type="submit" className="flex-1 bg-black text-white py-4 shadow-xl">Save</Button>
                           </div>
                        </form>
                     </Card>
                  )}

                  <div className="space-y-3">
                     {routes.map(r => (
                        <Card key={r._id} className="p-5 flex justify-between items-center bg-white border-2 border-black shadow-md">
                           <div className="flex-1">
                              <p className="font-black text-black text-lg">{r.name}</p>
                              <p className="text-[10px] text-gray-500 font-bold mt-1 line-clamp-2">{r.rawRouteText}</p>
                           </div>
                           <div className="flex gap-2 ml-4">
                              <button onClick={() => { setEditMode(r._id); setFormData(r); setShowAddForm(true); }} className="text-xs font-bold underline">Edit</button>
                              <button onClick={() => handleDelete('/admin/route', r._id, fetchRoutes)} className="text-xs font-bold text-red-600 underline">Delete</button>
                           </div>
                        </Card>
                     ))}
                  </div>
               </div>
            )}

            {/* --- DRIVERS TAB --- */}
            {activeTab === 'drivers' && (
               <div className="space-y-4">
                  <div className="flex justify-between items-center bg-white p-5 rounded-[28px] border-2 border-black shadow-lg">
                     <h3 className="font-black text-black uppercase text-sm tracking-widest">Drivers</h3>
                     <button onClick={() => { setShowAddForm(true); setFormData({}); }} className="bg-black text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase shadow-xl hover:scale-105 active:scale-95 transition-all outline-none">+ Add</button>
                  </div>

                  {showAddForm && (
                     <Card className="p-8 bg-white border-4 border-black shadow-2xl rounded-[32px] animate-in slide-in-from-top-4">
                        <h4 className="font-black mb-4 uppercase text-xs">{editMode ? 'Edit Driver' : 'Add Driver'}</h4>
                        <form onSubmit={handleSaveDriver} className="space-y-4">
                           <input required value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Driver Name" className="w-full p-5 bg-gray-50 border-2 border-black rounded-3xl font-black text-black outline-none" />
                           <input required value={formData.phoneNumber || ''} onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} placeholder="Phone" className="w-full p-5 bg-gray-50 border-2 border-black rounded-3xl font-black text-black outline-none" />
                           <select
                              value={formData.assignedBusId || (formData.assignedBus ? formData.assignedBus._id : '')}
                              onChange={(e) => setFormData({ ...formData, assignedBusId: e.target.value })}
                              className="w-full p-5 bg-gray-50 border-2 border-black rounded-3xl font-black text-black outline-none"
                           >
                              <option value="">Select Assigned Bus (Optional)</option>
                              {buses.map(b => (
                                 <option key={b._id} value={b._id}>Bus {b.busNumber}</option>
                              ))}
                           </select>
                           <div className="flex gap-4">
                              <Button type="button" onClick={resetForm} className="flex-1 bg-gray-200 text-black py-4">Cancel</Button>
                              <Button type="submit" className="flex-1 bg-black text-white py-4 shadow-xl">Save</Button>
                           </div>
                        </form>
                     </Card>
                  )}

                  <div className="space-y-3">
                     {drivers.map(d => (
                        <Card key={d._id} className="p-5 flex justify-between items-center bg-white border-2 border-black shadow-md">
                           <div>
                              <p className="font-black text-black text-lg">{d.name}</p>
                              <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{d.phoneNumber}</p>
                              {d.assignedBus && <p className="text-[10px] bg-black text-white px-2 py-1 rounded inline-block mt-1">Bus {d.assignedBus.busNumber}</p>}
                              {d.otp && <p className="text-[10px] text-blue-500 font-mono mt-1">OTP: {d.otp}</p>}
                           </div>
                           <div className="flex gap-2">
                              <button onClick={() => { setEditMode(d._id); setFormData(d); setShowAddForm(true); }} className="text-xs font-bold underline">Edit</button>
                              <button onClick={() => handleDelete('/admin/driver', d._id, fetchDrivers)} className="text-xs font-bold text-red-600 underline">Delete</button>
                           </div>
                        </Card>
                     ))}
                  </div>
               </div>
            )}

            {/* --- BUSES TAB --- */}
            {activeTab === 'buses' && (
               <div className="space-y-4">
                  <div className="flex justify-between items-center bg-white p-5 rounded-[28px] border-2 border-black shadow-lg">
                     <h3 className="font-black text-black uppercase text-sm tracking-widest">Bus Management</h3>
                     <button onClick={() => { setShowAddForm(true); setFormData({}); }} className="bg-black text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase shadow-xl hover:scale-105 active:scale-95 transition-all outline-none">+ Add</button>
                  </div>

                  {showAddForm && (
                     <Card className="p-8 bg-white border-4 border-black shadow-2xl rounded-[32px] animate-in slide-in-from-top-4">
                        <h4 className="font-black mb-4 uppercase text-xs">{editMode ? 'Edit Bus' : 'Add Bus'}</h4>
                        <form onSubmit={handleSaveBus} className="space-y-4">
                           <input required value={formData.busNumber || ''} onChange={(e) => setFormData({ ...formData, busNumber: e.target.value })} placeholder="Bus Number (e.g., 21)" className="w-full p-5 bg-gray-50 border-2 border-black rounded-3xl font-black text-black outline-none" />
                           <input required value={formData.capacity || ''} onChange={(e) => setFormData({ ...formData, capacity: e.target.value })} placeholder="Capacity" type="number" className="w-full p-5 bg-gray-50 border-2 border-black rounded-3xl font-black text-black outline-none" />
                           <input required value={formData.route || ''} onChange={(e) => setFormData({ ...formData, route: e.target.value })} placeholder="Route Name" className="w-full p-5 bg-gray-50 border-2 border-black rounded-3xl font-black text-black outline-none" />
                           <div className="flex gap-4">
                              <Button type="button" onClick={resetForm} className="flex-1 bg-gray-200 text-black py-4">Cancel</Button>
                              <Button type="submit" className="flex-1 bg-black text-white py-4 shadow-xl">Save</Button>
                           </div>
                        </form>
                     </Card>
                  )}

                  <div className="space-y-3">
                     {buses.map(bus => (
                        <Card key={bus._id} className="p-5 flex justify-between items-center bg-white border-2 border-black shadow-md">
                           <div>
                              <p className="font-black text-black text-lg">Bus {bus.busNumber}</p>
                              <p className="text-[10px] text-gray-500 font-bold mt-1">Route: {bus.route} | Capacity: {bus.capacity}</p>
                           </div>
                           <div className="flex gap-2">
                              <button onClick={() => { setEditMode(bus._id); setFormData(bus); setShowAddForm(true); }} className="text-xs font-bold underline">Edit</button>
                              <button onClick={() => handleDelete('/admin/bus', bus._id, fetchBuses)} className="text-xs font-bold text-red-600 underline">Delete</button>
                           </div>
                        </Card>
                     ))}
                  </div>
               </div>
            )}
         </div>
      </div>
   );
};
