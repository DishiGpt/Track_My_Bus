
import React, { useState, useEffect } from 'react';
import { Bus } from '../types';
import { Header, Card } from './Shared';

interface StudentViewProps {
  onLogout: () => void;
  buses: Bus[];
}

export const StudentView: React.FC<StudentViewProps> = ({ onLogout, buses }) => {
  const [selectedBusId, setSelectedBusId] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<string>(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const [showRefreshNotice, setShowRefreshNotice] = useState(false);
  
  const activeBuses = buses.filter(b => !b.isDisabled);
  const bus = activeBuses.find(b => b.id === selectedBusId);

  const handleRefresh = () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    // Simulate real-time data sync with clear UI feedback
    setTimeout(() => {
      setIsRefreshing(false);
      setLastRefreshed(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setShowRefreshNotice(true);
      setTimeout(() => setShowRefreshNotice(false), 2000);
    }, 1200);
  };

  const BusIcon = ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 11H6V6h12v5zM12 2c-4 0-8 .5-8 4v9.5C4 17.43 5.57 19 7.5 19L6 20.5v.5h12v-.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V6c0-3.5-4-4-8-4z" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <Header title="Bus Tracker" subtitle="Campus Transit Network" onLogout={onLogout} />
      
      <div className="p-4 space-y-4">
        <div className="flex gap-2 relative">
          <select 
            className="flex-1 p-4 bg-white border-2 border-black rounded-2xl font-black text-black shadow-sm outline-none appearance-none cursor-pointer"
            value={selectedBusId}
            onChange={(e) => setSelectedBusId(e.target.value)}
          >
            <option value="">Select Your Route</option>
            {activeBuses.map(b => (
              <option key={b.id} value={b.id}>Bus {b.busNumber} - {b.route}</option>
            ))}
          </select>
          <button 
            onClick={handleRefresh}
            className={`p-4 bg-black text-white rounded-2xl transition-all shadow-lg active:scale-95 flex items-center justify-center disabled:bg-gray-400`}
            disabled={isRefreshing}
            title="Refresh location data"
          >
            <svg className={`w-6 h-6 ${isRefreshing ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>

          {showRefreshNotice && (
            <div className="absolute -bottom-10 left-0 right-0 text-center animate-in fade-in slide-in-from-top-1 duration-300">
               <span className="bg-green-600 text-white text-[10px] font-black uppercase px-4 py-1.5 rounded-full shadow-lg border border-white/20">Location Updated Live</span>
            </div>
          )}
        </div>

        {bus ? (
          <div className="space-y-4 animate-in fade-in duration-500 mt-6">
            <div className="bg-yellow-200 border-2 border-black p-4 rounded-3xl flex items-center justify-between shadow-md">
               <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black bg-black text-white px-2 py-1 rounded-lg uppercase tracking-widest">Next</span>
                  <p className="font-black text-base">{bus.stops.find(s => s.status === 'upcoming' || s.status === 'current')?.name || 'Campus'}</p>
               </div>
               <span className="text-xs font-black text-red-600 border-2 border-red-200 bg-white px-3 py-1 rounded-xl">Live Sync</span>
            </div>

            <div className="bg-white border-2 border-black rounded-[32px] overflow-hidden shadow-2xl">
               <div className="bg-black p-5 text-white flex justify-between items-center">
                  <div>
                    <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Last Updated: {lastRefreshed}</p>
                    <p className="font-black text-lg">Departed from {bus.stops[0]?.name || 'First Stop'}</p>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center animate-pulse shadow-inner">
                     <BusIcon className="w-7 h-7" />
                  </div>
               </div>

               <div className="p-8 relative">
                  <div className="absolute left-10 top-10 bottom-10 w-1.5 bg-gray-100"></div>
                  
                  <div className="space-y-12">
                     {bus.stops.length === 0 && <p className="text-center font-black text-gray-300 py-10">No stops defined for this route.</p>}
                     {bus.stops.map((stop, idx) => (
                        <div key={idx} className={`relative flex items-center transition-opacity ${stop.status === 'visited' ? 'opacity-40' : 'opacity-100'}`}>
                           <div className="w-16 text-center">
                              <p className="text-xs font-black text-black leading-none mb-1">{stop.name}</p>
                              <p className="text-[10px] font-bold text-gray-400">{stop.scheduledTime}</p>
                           </div>

                           <div className="mx-5 relative">
                              <div className={`w-6 h-6 rounded-full border-4 border-white shadow-md z-20 relative transition-all duration-500 ${
                                stop.status === 'visited' ? 'bg-gray-400' : 
                                stop.status === 'current' ? 'bg-blue-600 scale-125 ring-4 ring-blue-50' : 
                                'bg-gray-200'
                              }`}></div>
                              {stop.status === 'current' && (
                                <div className="absolute -top-12 -left-3 z-30 bg-blue-600 text-white p-2.5 rounded-2xl shadow-xl animate-bounce border-2 border-white">
                                   <BusIcon className="w-5 h-5" />
                                </div>
                              )}
                           </div>

                           <div className={`flex-1 p-4 rounded-2xl border-2 transition-all duration-300 ${stop.status === 'current' ? 'bg-blue-50 border-blue-600 shadow-md' : 'bg-gray-50 border-transparent'}`}>
                              <div className="flex justify-between items-center">
                                 <div>
                                    <h4 className="font-black text-sm text-black">{stop.name}</h4>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Status: {stop.status.toUpperCase()}</p>
                                 </div>
                                 <div className="text-right">
                                    <p className="text-[10px] font-black text-red-500">Sch: {stop.scheduledTime}</p>
                                 </div>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>

            <div className="bg-white p-5 rounded-[32px] border-2 border-black flex items-center justify-between shadow-lg">
               <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-black text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-xl">
                     {bus.driverName.charAt(0)}
                  </div>
                  <div>
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Driver Contact</p>
                     <p className="font-black text-lg text-black leading-tight">{bus.driverName}</p>
                  </div>
               </div>
               <button 
                  onClick={() => window.location.href = `tel:${bus.driverContact}`}
                  className="bg-green-600 text-white p-5 rounded-3xl shadow-xl active:scale-90 border-b-4 border-green-800 transition-all"
               >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
               </button>
            </div>
          </div>
        ) : (
          <div className="pt-32 text-center opacity-40 select-none">
             <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-8 flex items-center justify-center border-2 border-dashed border-black/10">
                <BusIcon className="w-12 h-12 text-black" />
             </div>
             <p className="font-black text-2xl uppercase tracking-tighter text-black">Route Monitor</p>
             <p className="text-gray-500 font-bold mt-2">Please select your route above.</p>
          </div>
        )}
      </div>
    </div>
  );
};
