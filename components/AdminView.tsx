
import React, { useState } from 'react';
import { Header, Card } from './Shared';

export const AdminView: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'buses' | 'coordinators' | 'students' | 'drivers'>('buses');

  const tabs = [
    { id: 'buses', label: 'Bus Management' },
    { id: 'coordinators', label: 'Coordinators' },
    { id: 'students', label: 'Students' },
    { id: 'drivers', label: 'Drivers' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Super Admin Control" subtitle="Total System Access" onLogout={onLogout} />
      
      <div className="flex bg-white shadow-sm border-b overflow-x-auto">
         {tabs.map(tab => (
           <button 
             key={tab.id}
             onClick={() => setActiveTab(tab.id as any)}
             className={`px-6 py-4 text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all border-b-4 ${activeTab === tab.id ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50' : 'border-transparent text-gray-400'}`}
           >
             {tab.label}
           </button>
         ))}
      </div>

      <div className="p-5">
         <Card className="p-8 border-none shadow-xl bg-white mb-6">
            <h3 className="text-xl font-black text-gray-900 mb-2">{tabs.find(t => t.id === activeTab)?.label} Control</h3>
            <p className="text-gray-500 text-sm mb-8">As a developer admin, you have full write/read access to all records in the {activeTab} collection.</p>
            
            <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">
               <div className="flex items-center justify-between mb-6">
                  <span className="text-[10px] font-black uppercase text-indigo-400">Registered {activeTab}</span>
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase shadow-lg shadow-indigo-100">Add New</button>
               </div>
               
               <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-900 rounded-xl"></div>
                          <div>
                             <p className="font-bold text-gray-800">Record #{i}04{i}</p>
                             <p className="text-[10px] text-gray-400 font-mono">UUID: f72-491-a{i}c</p>
                          </div>
                       </div>
                       <div className="flex gap-2">
                          <button className="p-2 hover:bg-gray-50 text-indigo-600 rounded-lg"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
                          <button className="p-2 hover:bg-gray-50 text-red-400 rounded-lg"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </Card>

         <div className="grid grid-cols-2 gap-4">
            <Card className="bg-indigo-900 p-4 text-white">
               <p className="text-[10px] font-bold opacity-50 uppercase mb-1">API Status</p>
               <p className="text-xl font-black">200 OK</p>
            </Card>
            <Card className="bg-gray-900 p-4 text-white">
               <p className="text-[10px] font-bold opacity-50 uppercase mb-1">Server Load</p>
               <p className="text-xl font-black">12%</p>
            </Card>
         </div>
      </div>
    </div>
  );
};
