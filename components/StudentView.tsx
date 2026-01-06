
import React, { useState } from 'react';
import { Bus, Stop } from '../types';
import { MOCK_BUSES } from '../mockData';
import { Header, Card } from './Shared';

export const StudentView: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [selectedBusId, setSelectedBusId] = useState<string>('');
  const bus = MOCK_BUSES.find(b => b.id === selectedBusId);

  return (
    <div className="min-h-screen bg-white">
      <Header title="Track My Bus" subtitle="Student Interface" onLogout={onLogout} />
      
      <div className="p-5 space-y-6">
        <div className="relative">
          <label className="block text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2 ml-1">Select a bus number</label>
          <select 
            className="w-full p-5 bg-indigo-50 border-2 border-indigo-100 rounded-2xl outline-none focus:border-indigo-600 font-bold text-gray-900 appearance-none shadow-sm"
            value={selectedBusId}
            onChange={(e) => setSelectedBusId(e.target.value)}
          >
            <option value="">Choose Bus Route</option>
            {MOCK_BUSES.map(b => (
              <option key={b.id} value={b.id}>{b.busNumber} - {b.route}</option>
            ))}
          </select>
          <div className="absolute right-5 bottom-5 pointer-events-none text-indigo-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
          </div>
        </div>

        {bus ? (
          <div className="animate-in slide-in-from-bottom-6 duration-500">
            <Card className="mb-6 border-none shadow-xl overflow-visible">
               <div className="bg-indigo-600 p-6 rounded-t-2xl text-white relative">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs font-bold uppercase opacity-60">Live Route</p>
                      <h3 className="text-3xl font-black">{bus.busNumber}</h3>
                    </div>
                    <div className="text-right">
                       <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${bus.isGpsActive ? 'bg-green-400 text-green-900' : 'bg-gray-400 text-gray-800'}`}>
                        {bus.isGpsActive ? '● Active' : 'Offline'}
                       </span>
                    </div>
                  </div>
               </div>
               <div className="p-6 bg-white rounded-b-2xl border border-gray-100 flex justify-between items-center -mt-2">
                  <div className="flex items-center gap-3">
                     <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-indigo-600 font-black">
                        {bus.driverName.charAt(0)}
                     </div>
                     <div>
                        <p className="text-xs font-bold text-gray-400">Driver</p>
                        <p className="font-bold text-gray-800">{bus.driverName}</p>
                     </div>
                  </div>
                  <a href={`tel:${bus.driverContact}`} className="w-12 h-12 bg-green-500 text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-90 transition-all">
                     <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                  </a>
               </div>
            </Card>

            <div className="relative pl-8 space-y-8 before:content-[''] before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-0.5 before:bg-indigo-100">
               {bus.stops.map((stop, idx) => (
                 <div key={stop.id} className="relative">
                    <div className={`absolute -left-[27px] top-1 w-4 h-4 rounded-full border-4 border-white z-10 ${stop.status === 'visited' ? 'bg-green-500' : stop.status === 'current' ? 'bg-indigo-600 ring-4 ring-indigo-100' : 'bg-gray-300'}`}></div>
                    <div className="flex justify-between items-center">
                       <div>
                          <p className={`font-black ${stop.status === 'visited' ? 'text-gray-400 line-through' : 'text-gray-800'}`}>{stop.name}</p>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Sch: {stop.scheduledTime}</p>
                       </div>
                       {stop.actualTime && <span className="text-xs font-black text-green-600 bg-green-50 px-2 py-1 rounded-lg">ARRIVED {stop.actualTime}</span>}
                    </div>
                 </div>
               ))}
            </div>
          </div>
        ) : (
          <div className="pt-20 text-center opacity-30 grayscale">
             <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
             </div>
             <p className="font-black text-xl text-gray-900">TRACKING SYSTEM</p>
             <p className="text-sm text-gray-700">Select a route to view map & stops</p>
          </div>
        )}
      </div>
    </div>
  );
};
