
import React, { useState, useEffect } from 'react';
import { User, Bus, UserRole } from '../types';
import { Header, Card, Button } from './Shared';

interface AdminViewProps {
  onLogout: () => void;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  buses: Bus[];
}

export const AdminView: React.FC<AdminViewProps> = ({ onLogout, users, setUsers, buses }) => {
  const [activeTab, setActiveTab] = useState<'home' | 'buses' | 'coordinators' | 'students'>('home');
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [fName, setFName] = useState('');
  const [fPhone, setFPhone] = useState('');
  const [fRole, setFRole] = useState<UserRole>(UserRole.STUDENT);

  const tabs = [
    { id: 'home', label: 'Home' },
    { id: 'buses', label: 'Buses' },
    { id: 'coordinators', label: 'Coordinators' },
    { id: 'students', label: 'Students' }
  ];

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fName || !fPhone) return;
    const newUser: User = {
      id: Date.now().toString(),
      name: fName,
      phoneNumber: fPhone,
      password: 'password123',
      role: fRole
    };
    setUsers(prev => [...prev, newUser]);
    setFName(''); setFPhone('');
    setShowAddForm(false);
    alert(`${fRole} created successfully!`);
  };

  // FIXED DELETION LOGIC
  const handleDeleteUser = (id: string) => {
    const userToDelete = users.find(u => u.id === id);
    if (!userToDelete) return;
    
    if (userToDelete.phoneNumber === '1111111111') {
       alert("CRITICAL: Cannot delete the Super Admin account.");
       return;
    }

    if (confirm(`ARE YOU SURE? This will permanently delete the account for ${userToDelete.name} (${userToDelete.role}).`)) {
      setUsers(prevUsers => {
        const updated = prevUsers.filter(u => u.id !== id);
        return updated;
      });
      alert("Success: User record removed.");
    }
  };

  const filteredUsers = users.filter(u => {
    if (activeTab === 'coordinators') return u.role === UserRole.COORDINATOR;
    if (activeTab === 'students') return u.role === UserRole.STUDENT;
    return true;
  });

  // ANALYTICS DATA
  const studentCount = users.filter(u => u.role === UserRole.STUDENT).length;
  const coordCount = users.filter(u => u.role === UserRole.COORDINATOR).length;
  const adminCount = users.filter(u => u.role === UserRole.ADMIN).length;
  const driverCount = users.filter(u => u.role === UserRole.DRIVER).length;
  const totalUsers = users.length;
  const totalBuses = buses.length;
  const activeBuses = buses.filter(b => !b.isDisabled).length;
  const inactiveBuses = totalBuses - activeBuses;
  const gpsActive = buses.filter(b => b.isGpsActive).length;

  // CHART COMPONENTS
  const RouteUsageChart = () => {
    const data = [
      { name: 'Bhuwana', val: 85 },
      { name: 'Bedla', val: 65 },
      { name: 'Tekri', val: 45 },
      { name: 'Rampura', val: 30 }
    ];
    return (
      <div className="space-y-3 w-full">
        {data.map(d => (
          <div key={d.name} className="space-y-1">
            <div className="flex justify-between text-[10px] font-black uppercase">
              <span>{d.name}</span>
              <span>{d.val}% Usage</span>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden border border-black/5">
              <div className="bg-black h-full transition-all duration-1000" style={{ width: `${d.val}%` }}></div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-black">
      <Header title="Super Admin Dashboard" subtitle="System Control Panel" onLogout={onLogout} />
      
      <div className="flex bg-white shadow-sm border-b-2 border-black overflow-x-auto sticky top-[64px] z-40">
         {tabs.map(tab => (
           <button 
             key={tab.id}
             onClick={() => setActiveTab(tab.id as any)}
             className={`px-8 py-4 text-[10px] font-black uppercase tracking-widest transition-all border-b-4 ${activeTab === tab.id ? 'border-black text-black bg-white' : 'border-transparent text-gray-400'}`}
           >
             {tab.label}
           </button>
         ))}
      </div>

      <div className="p-4 space-y-6">
        {activeTab === 'home' && (
          <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            {/* SECTION 1: SYSTEM OVERVIEW CARDS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
               <div className="bg-black text-white p-5 rounded-[24px] shadow-xl">
                  <div className="flex justify-between items-start mb-2">
                     <div className="bg-white/20 p-2 rounded-lg">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18 11H6V6h12v5zM12 2c-4 0-8 .5-8 4v9.5C4 17.43 5.57 19 7.5 19L6 20.5v.5h12v-.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V6c0-3.5-4-4-8-4z"/></svg>
                     </div>
                     <span className="text-[10px] font-black opacity-60">TOTAL</span>
                  </div>
                  <p className="text-3xl font-black">{totalBuses}</p>
                  <p className="text-[10px] font-bold opacity-60 uppercase">Buses Registered</p>
               </div>
               
               <div className="bg-white border-2 border-black p-5 rounded-[24px] shadow-md">
                  <div className="flex justify-between items-start mb-2">
                     <div className="bg-black/5 p-2 rounded-lg">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                     </div>
                     <span className="text-[10px] font-black text-green-600">LIVE</span>
                  </div>
                  <p className="text-3xl font-black">{activeBuses}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Active Now</p>
               </div>

               <div className="bg-white border-2 border-black p-5 rounded-[24px] shadow-md">
                  <div className="flex justify-between items-start mb-2">
                     <div className="bg-black/5 p-2 rounded-lg">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
                     </div>
                  </div>
                  <p className="text-3xl font-black">{studentCount}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Students</p>
               </div>

               <div className="bg-white border-2 border-black p-5 rounded-[24px] shadow-md">
                  <div className="flex justify-between items-start mb-2">
                     <div className="bg-black/5 p-2 rounded-lg text-red-600">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                     </div>
                  </div>
                  <p className="text-3xl font-black">{inactiveBuses}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Alerts/Inactive</p>
               </div>
            </div>

            {/* SECTION 2: LIVE BUS STATUS OVERVIEW */}
            <Card className="p-6 bg-white border-2 border-black shadow-lg">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="font-black uppercase text-sm tracking-widest">Live Bus Monitor</h3>
                  <div className="flex gap-2">
                     <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div><span className="text-[8px] font-black uppercase">On Time</span></div>
                     <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-yellow-500"></div><span className="text-[8px] font-black uppercase">Delayed</span></div>
                  </div>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {buses.slice(0, 4).map(bus => (
                     <div key={bus.id} className="flex items-center justify-between p-4 bg-gray-50 border border-black/5 rounded-2xl">
                        <div className="flex items-center gap-3">
                           <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${bus.isDisabled ? 'bg-red-100 text-red-600' : 'bg-black text-white'}`}>
                              {bus.busNumber}
                           </div>
                           <div>
                              <p className="font-black text-xs">{bus.driverName}</p>
                              <p className="text-[10px] font-bold text-gray-400 uppercase">{bus.route}</p>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className={`text-[10px] font-black uppercase ${bus.isDisabled ? 'text-red-500' : 'text-green-500'}`}>
                              {bus.isDisabled ? 'Inactive' : 'On Route'}
                           </p>
                           <p className="text-[8px] font-bold text-gray-400">GPS: {bus.isGpsActive ? 'ONLINE' : 'OFF'}</p>
                        </div>
                     </div>
                  ))}
               </div>
            </Card>

            {/* SECTION 3 & 4: ANALYTICS & ACTIVITY */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               <Card className="p-8 bg-white border-2 border-black shadow-sm">
                  <h3 className="font-black uppercase text-sm mb-6 tracking-widest">Route Popularity</h3>
                  <RouteUsageChart />
                  <div className="mt-8 pt-6 border-t border-black/5 flex justify-around">
                     <div className="text-center">
                        <p className="text-2xl font-black">08:15</p>
                        <p className="text-[8px] font-bold text-gray-400 uppercase">Peak Time</p>
                     </div>
                     <div className="text-center">
                        <p className="text-2xl font-black">12m</p>
                        <p className="text-[8px] font-bold text-gray-400 uppercase">Avg Delay</p>
                     </div>
                  </div>
               </Card>

               <Card className="p-8 bg-black text-white shadow-2xl">
                  <h3 className="font-black uppercase text-sm mb-6 tracking-widest">System Change Log</h3>
                  <div className="space-y-4">
                     {[
                       { time: '10:45 AM', act: 'Route 12 modified by Coordinator', icon: '📝' },
                       { time: '09:30 AM', act: 'Bus 10 GPS manually disabled', icon: '📡' },
                       { time: '08:00 AM', act: 'Daily morning notification sent', icon: '🔔' },
                       { time: 'Yesterday', act: '3 New students registered', icon: '👥' }
                     ].map((l, i) => (
                        <div key={i} className="flex gap-4 items-start pb-4 border-b border-white/10 last:border-0">
                           <span className="text-xl">{l.icon}</span>
                           <div>
                              <p className="text-xs font-black">{l.act}</p>
                              <p className="text-[10px] font-bold opacity-40">{l.time}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </Card>
            </div>

            {/* SECTION 5: QUICK ACTIONS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
               <button onClick={() => setActiveTab('buses')} className="p-6 bg-white border-2 border-black rounded-3xl font-black uppercase text-[10px] shadow-md hover:bg-gray-50 transition-all active:scale-95">Add New Bus</button>
               <button onClick={() => setActiveTab('coordinators')} className="p-6 bg-white border-2 border-black rounded-3xl font-black uppercase text-[10px] shadow-md hover:bg-gray-50 transition-all active:scale-95">Manage Coords</button>
               <button className="p-6 bg-white border-2 border-black rounded-3xl font-black uppercase text-[10px] shadow-md hover:bg-gray-50 transition-all active:scale-95">Send Broadcast</button>
               <button onClick={() => {if(confirm('Reset all analytics for a new cycle?')){alert('Analytics Reset Successfully')}}} className="p-6 bg-red-50 border-2 border-red-200 text-red-600 rounded-3xl font-black uppercase text-[10px] shadow-md hover:bg-red-100 transition-all active:scale-95">Reset System</button>
            </div>

            {/* SECTION 6: SYSTEM HEALTH ALERTS */}
            {inactiveBuses > 0 && (
               <div className="bg-red-50 border-2 border-red-600 p-6 rounded-[32px] flex items-center gap-6 shadow-xl animate-pulse">
                  <div className="bg-red-600 text-white w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black">!</div>
                  <div>
                     <h4 className="font-black text-red-600 uppercase text-sm">System Health Warning</h4>
                     <p className="text-xs font-bold text-red-400">{inactiveBuses} buses are currently marked as disabled or have GPS off. Action required.</p>
                  </div>
               </div>
            )}
          </div>
        )}

        {(activeTab === 'coordinators' || activeTab === 'students') && (
           <div className="space-y-4 pb-20">
              <div className="flex justify-between items-center bg-white p-5 rounded-[28px] border-2 border-black shadow-lg">
                 <h3 className="font-black text-black uppercase text-sm tracking-widest">{activeTab} List</h3>
                 <button onClick={() => setShowAddForm(true)} className="bg-black text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase shadow-xl hover:scale-105 active:scale-95 transition-all">+ Add New</button>
              </div>

              {showAddForm && (
                <Card className="p-8 bg-white border-4 border-black shadow-2xl rounded-[32px] animate-in slide-in-from-top-4">
                   <div className="flex justify-between items-center mb-6">
                      <h4 className="font-black uppercase text-sm">New Registration</h4>
                      <button onClick={() => setShowAddForm(false)} className="text-black font-black uppercase text-[10px] bg-gray-100 p-2 rounded-lg">Cancel</button>
                   </div>
                   <form onSubmit={handleAddEntry} className="space-y-4">
                      <input required value={fName} onChange={(e) => setFName(e.target.value)} placeholder="Full Name" className="w-full p-5 bg-gray-50 border-2 border-black rounded-3xl font-black text-black text-lg outline-none focus:ring-4 focus:ring-black/10" />
                      <input required value={fPhone} onChange={(e) => setFPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="Phone" className="w-full p-5 bg-gray-50 border-2 border-black rounded-3xl font-black text-black text-lg outline-none focus:ring-4 focus:ring-black/10" />
                      <div className="flex gap-2">
                        <button type="button" onClick={() => setFRole(UserRole.STUDENT)} className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase border-2 transition-all ${fRole === UserRole.STUDENT ? 'bg-black text-white border-black shadow-lg scale-105' : 'bg-white text-black border-black/10 opacity-50'}`}>Student</button>
                        <button type="button" onClick={() => setFRole(UserRole.COORDINATOR)} className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase border-2 transition-all ${fRole === UserRole.COORDINATOR ? 'bg-black text-white border-black shadow-lg scale-105' : 'bg-white text-black border-black/10 opacity-50'}`}>Coordinator</button>
                      </div>
                      <Button type="submit" className="bg-black text-white py-5 mt-4 text-xl tracking-widest shadow-xl border-b-4 border-gray-900">Confirm Registry</Button>
                   </form>
                </Card>
              )}

              <div className="space-y-3">
                 {filteredUsers.length === 0 && <p className="text-center py-10 font-black text-gray-400">No users found.</p>}
                 {filteredUsers.map(user => (
                    <Card key={user.id} className="p-5 flex justify-between items-center bg-white border-2 border-black shadow-md transition-all hover:translate-x-1">
                       <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-gray-100 border-2 border-black/10 rounded-2xl flex items-center justify-center font-black text-black text-xl shadow-inner">{user.name.charAt(0)}</div>
                          <div>
                             <p className="font-black text-black text-lg leading-tight">{user.name}</p>
                             <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{user.phoneNumber} | {user.role}</p>
                          </div>
                       </div>
                       <button 
                         onClick={() => handleDeleteUser(user.id)} 
                         className="bg-red-50 text-red-600 p-4 rounded-2xl border-2 border-red-100 hover:bg-red-600 hover:text-white active:scale-90 transition-all shadow-sm"
                       >
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                       </button>
                    </Card>
                 ))}
              </div>
           </div>
        )}

        {activeTab === 'buses' && (
           <div className="space-y-4 pb-20">
              {buses.length === 0 && <p className="text-center py-10 font-black text-gray-400">No buses registered.</p>}
              {buses.map(bus => (
                 <Card key={bus.id} className={`p-6 bg-white border-2 border-black shadow-xl ${bus.isDisabled ? 'opacity-50' : ''}`}>
                    <div className="flex items-center justify-between">
                       <div>
                          <h4 className="font-black text-2xl text-black">Bus {bus.busNumber}</h4>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{bus.route} | {bus.driverName}</p>
                       </div>
                       <div className="text-right">
                          <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase border-2 ${!bus.isDisabled ? 'bg-green-600 text-white border-green-700 shadow-md' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                             {!bus.isDisabled ? 'ACTIVE' : 'DISABLED'}
                          </span>
                       </div>
                    </div>
                 </Card>
              ))}
           </div>
        )}
      </div>
    </div>
  );
};
