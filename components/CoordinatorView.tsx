
import React, { useState } from 'react';
import { MOCK_BUSES, MOCK_DRIVERS } from '../mockData';
import { Header, Card, Button } from './Shared';

export const CoordinatorView: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'view' | 'add' | 'delete' | 'drivers'>('view');
  const [buses, setBuses] = useState(MOCK_BUSES);

  const tabs = [
    { id: 'view', label: 'बसें देखें' },
    { id: 'add', label: 'बस जोड़ें' },
    { id: 'delete', label: 'बस हटाएं' },
    { id: 'drivers', label: 'ड्राइवर प्रबंधन' }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header title="समन्वयक डैशबोर्ड" subtitle="हिंदी इंटरफ़ेस" onLogout={onLogout} />
      
      <div className="flex p-2 bg-gray-50 border-b overflow-x-auto gap-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-shrink-0 px-5 py-3 rounded-2xl text-sm font-black uppercase tracking-tighter transition-all ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white text-gray-400 border border-gray-100'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-5">
        {activeTab === 'view' && (
          <div className="space-y-4">
            {buses.map(bus => (
              <Card key={bus.id} className="p-5 border-2 border-indigo-50">
                <div className="flex justify-between items-center mb-4">
                   <input className="text-xl font-black text-gray-900 bg-transparent border-none outline-none focus:bg-indigo-50 p-1 rounded" defaultValue={bus.busNumber} />
                   <button className="text-indigo-600 font-bold text-xs bg-indigo-50 px-3 py-1 rounded-full uppercase">बदलें</button>
                </div>
                <div className="space-y-3">
                   <div className="flex justify-between border-b pb-2 text-gray-900">
                      <span className="text-xs font-bold text-gray-400 uppercase">ड्राइवर का नाम</span>
                      <input className="font-bold text-right bg-transparent outline-none text-gray-900" defaultValue={bus.driverNameHindi} />
                   </div>
                   <div className="flex justify-between border-b pb-2 text-gray-900">
                      <span className="text-xs font-bold text-gray-400 uppercase">फ़ोन नंबर</span>
                      <span className="font-mono text-xs text-gray-900">{bus.driverContact}</span>
                   </div>
                   <div className="pt-2">
                      <span className="text-[10px] font-black text-gray-400 uppercase mb-2 block">स्टॉप सूची</span>
                      <div className="flex flex-wrap gap-2">
                         {bus.stops.map(s => <span key={s.id} className="text-[10px] font-bold bg-gray-100 px-2 py-1 rounded-md text-gray-800">{s.nameHindi}</span>)}
                         <button className="text-indigo-600 font-black text-[10px] border border-dashed border-indigo-200 px-2 py-1 rounded-md">+ स्टॉप जोड़ें</button>
                      </div>
                   </div>
                </div>
                <Button className="mt-6 bg-indigo-600 text-white text-sm">विवरण सुरक्षित करें</Button>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'add' && (
          <Card className="p-6">
            <h3 className="text-2xl font-black mb-6 text-gray-900">नई बस का विवरण दर्ज करें</h3>
            <div className="space-y-4">
               <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase">बस नंबर</label>
                  <input className="w-full p-4 bg-gray-50 border rounded-2xl outline-none text-gray-900" placeholder="उदा. MH-12-AZ-1234" />
               </div>
               <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase">ड्राइवर का नाम (हिंदी में)</label>
                  <input className="w-full p-4 bg-gray-50 border rounded-2xl outline-none text-gray-900" placeholder="ड्राइवर का नाम" />
               </div>
               <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase">रूट का नाम (हिंदी में)</label>
                  <input className="w-full p-4 bg-gray-50 border rounded-2xl outline-none text-gray-900" placeholder="रूट का नाम" />
               </div>
               <Button className="bg-green-600 text-white py-5 shadow-xl !mt-6">बस रजिस्टर करें</Button>
            </div>
          </Card>
        )}

        {activeTab === 'delete' && (
           <div className="space-y-3">
              {buses.map(bus => (
                <Card key={bus.id} className="p-4 flex justify-between items-center border-l-4 border-l-red-500">
                   <div>
                      <p className="font-black text-gray-800">{bus.busNumber}</p>
                      <p className="text-xs text-gray-400">{bus.routeHindi}</p>
                   </div>
                   <button className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-xs font-black uppercase">हटाएं</button>
                </Card>
              ))}
           </div>
        )}

        {activeTab === 'drivers' && (
           <div className="space-y-4">
              <Button className="bg-indigo-600 text-white mb-4">+ नया ड्राइवर जोड़ें</Button>
              {MOCK_DRIVERS.map(d => (
                <Card key={d.id} className="p-4 flex justify-between items-center">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center font-bold text-indigo-600">{d.nameHindi.charAt(0)}</div>
                      <div>
                         <p className="font-bold text-gray-800">{d.nameHindi}</p>
                         <p className="text-xs text-gray-500 font-mono">{d.phoneNumber}</p>
                      </div>
                   </div>
                   <button className="text-gray-300 hover:text-red-500"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                </Card>
              ))}
           </div>
        )}
      </div>
    </div>
  );
};
