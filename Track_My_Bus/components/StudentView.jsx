import React, { useState, useEffect } from 'react';
import { Header, Card } from './Shared';
import api from '../src/api/axios';

export const StudentView = ({ onLogout }) => {
   const [selectedRoute, setSelectedRoute] = useState('');
   const [routes, setRoutes] = useState([]);
   const [activeBuses, setActiveBuses] = useState([]);
   const [isRefreshing, setIsRefreshing] = useState(false);
   const [lastRefreshed, setLastRefreshed] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
   const [showRefreshNotice, setShowRefreshNotice] = useState(false);

   // Fetch All Routes on Mount
   useEffect(() => {
      const fetchRoutes = async () => {
         try {
            const res = await api.get('/student/routes');
            setRoutes(res.data);
         } catch (err) {
            console.error('Error fetching routes:', err);
         }
      };
      fetchRoutes();
   }, []);

   // Fetch Buses when Route Selected
   useEffect(() => {
      if (!selectedRoute) return;
      fetchBuses();
   }, [selectedRoute]);

   const fetchBuses = async () => {
      if (!selectedRoute) return;
      try {
         setIsRefreshing(true);
         const res = await api.get(`/student/buses/${selectedRoute}`);
         setActiveBuses(res.data);
         setLastRefreshed(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      } catch (err) {
         console.error('Error fetching buses:', err);
      } finally {
         setIsRefreshing(false);
      }
   };

   const handleRefresh = () => {
      if (isRefreshing) return;
      fetchBuses();
      // UI feedback
      setShowRefreshNotice(true);
      setTimeout(() => setShowRefreshNotice(false), 2000);
   };

   // For demo, just showing the first bus if multiple on same route
   const bus = activeBuses.length > 0 ? activeBuses[0] : null;

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
                  value={selectedRoute}
                  onChange={(e) => setSelectedRoute(e.target.value)}
               >
                  <option value="">Select Your Route</option>
                  {routes.map(r => (
                     <option key={r._id} value={r.name}>{r.name}</option>
                  ))}
               </select>
               <button
                  onClick={handleRefresh}
                  className={`p-4 bg-black text-white rounded-2xl transition-all shadow-lg active:scale-95 flex items-center justify-center disabled:bg-gray-400`}
                  disabled={isRefreshing || !selectedRoute}
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
                  {/* Reuse existing UI structure with fetched data */}
                  <div className="bg-white border-2 border-black rounded-[32px] overflow-hidden shadow-2xl">
                     <div className="bg-black p-5 text-white flex justify-between items-center">
                        <div>
                           <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Last Updated: {lastRefreshed}</p>
                           <p className="font-black text-lg">Bus {bus.busNumber}</p>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center animate-pulse shadow-inner">
                           <BusIcon className="w-7 h-7" />
                        </div>
                     </div>

                     <div className="p-8 relative">
                        {/* Mocking stops view for now as backend 'routes' might not populate full stops yet or need Route details */}
                        <div className="text-center py-4">
                           <p className="font-black text-xl">{bus.isLive ? 'LIVE ON ROUTE' : 'NOT STARTED'}</p>
                           <p className="text-gray-500">Driver: {bus.driverName}</p>
                           {bus.location && (
                              <p className="text-xs text-blue-600 mt-2 font-mono">
                                 LAT: {bus.location.lat?.toFixed(4)}, LNG: {bus.location.lng?.toFixed(4)}
                              </p>
                           )}
                        </div>
                     </div>
                  </div>
               </div>
            ) : (
               <div className="pt-32 text-center opacity-40 select-none">
                  <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-8 flex items-center justify-center border-2 border-dashed border-black/10">
                     <BusIcon className="w-12 h-12 text-black" />
                  </div>
                  <p className="font-black text-2xl uppercase tracking-tighter text-black">Route Monitor</p>
                  <p className="text-gray-500 font-bold mt-2">
                     {selectedRoute ? 'No buses live on this route.' : 'Please select your route above.'}
                  </p>
               </div>
            )}
         </div>
      </div>
   );
};
