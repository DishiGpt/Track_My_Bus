
import React, { useState } from 'react';
import { Bus, Driver, Stop } from '../types';
import { Header, Card, Button } from './Shared';

interface CoordinatorViewProps {
  onLogout: () => void;
  buses: Bus[];
  setBuses: React.Dispatch<React.SetStateAction<Bus[]>>;
  drivers: Driver[];
  setDrivers: React.Dispatch<React.SetStateAction<Driver[]>>;
}

export const CoordinatorView: React.FC<CoordinatorViewProps> = ({ onLogout, buses, setBuses, drivers, setDrivers }) => {
  const [activeTab, setActiveTab] = useState<'view' | 'add' | 'delete' | 'drivers'>('view');
  const [editingBusId, setEditingBusId] = useState<string | null>(null);
  const [addingStopBusId, setAddingStopBusId] = useState<string | null>(null);
  const [newStopName, setNewStopName] = useState('');
  
  // New Bus State
  const [newBusNo, setNewBusNo] = useState('');
  const [newDriverHindi, setNewDriverHindi] = useState('');
  const [newRouteHindi, setNewRouteHindi] = useState('');
  const [newStopsList, setNewStopsList] = useState('');

  // Edit Driver Form State
  const [editDName, setEditDName] = useState('');
  const [editDPhone, setEditDPhone] = useState('');

  // New Driver Tab State
  const [newDName, setNewDName] = useState('');
  const [newDPhone, setNewDPhone] = useState('');

  const handleRegisterBus = () => {
    if (!newBusNo || !newDriverHindi || !newRouteHindi) return alert("कृपया सभी विवरण भरें!");
    
    const stopsArray: Stop[] = newStopsList.split(',').filter(s => s.trim() !== '').map(s => ({
      id: Math.random().toString(36).substr(2, 9),
      name: s.trim().slice(0, 3).toUpperCase(),
      nameHindi: s.trim(),
      scheduledTime: '08:00 AM',
      status: 'upcoming'
    }));

    const newBus: Bus = {
      id: Date.now().toString(),
      busNumber: newBusNo,
      driverName: newDriverHindi, // Using Hindi name for both to ensure consistency
      driverNameHindi: newDriverHindi,
      driverContact: '90000 00000',
      route: newRouteHindi,
      routeHindi: newRouteHindi,
      isGpsActive: false,
      isDisabled: false,
      stops: stopsArray
    };
    
    setBuses(prev => [...prev, newBus]);
    setNewBusNo('');
    setNewDriverHindi('');
    setNewRouteHindi('');
    setNewStopsList('');
    alert("नई बस सफलतापूर्वक रजिस्टर की गई!");
    setActiveTab('view');
  };

  const handleAddStopInline = (busId: string) => {
    if (!newStopName.trim()) {
      alert("कृपया स्टॉप का नाम लिखें");
      return;
    }
    const newStop: Stop = {
      id: Date.now().toString(),
      name: newStopName.trim().slice(0, 3).toUpperCase(),
      nameHindi: newStopName.trim(),
      scheduledTime: '08:00 AM',
      status: 'upcoming'
    };
    
    setBuses(prevBuses => prevBuses.map(b => 
      b.id === busId ? { ...b, stops: [...b.stops, newStop] } : b
    ));
    
    setNewStopName('');
    setAddingStopBusId(null);
  };

  const startEditingDriver = (bus: Bus) => {
    setEditingBusId(bus.id);
    setEditDName(bus.driverNameHindi);
    setEditDPhone(bus.driverContact);
  };

  const saveDriverEdit = (busId: string) => {
    if (!editDName || !editDPhone) return alert("विवरण भरें");
    setBuses(prev => prev.map(b => b.id === busId ? { 
      ...b, 
      driverName: editDName, 
      driverNameHindi: editDName, 
      driverContact: editDPhone 
    } : b));
    setEditingBusId(null);
    alert("चालक विवरण अपडेट कर दिए गए!");
  };

  // FIXED BUS DELETION LOGIC
  const handleDeleteBus = (id: string) => {
    if (confirm("चेतावनी: क्या आप वाकई इस बस को सिस्टम से हमेशा के लिए हटाना चाहते हैं?")) {
      setBuses(prevBuses => {
        const updated = prevBuses.filter(b => b.id !== id);
        return updated;
      });
      alert("सफलता: बस को हटा दिया गया है।");
    }
  };

  const tabs = [
    { id: 'view', label: 'बसें देखें' },
    { id: 'add', label: 'नई बस' },
    { id: 'delete', label: 'हटाएं' },
    { id: 'drivers', label: 'चालक' }
  ];

  return (
    <div className="min-h-screen bg-gray-100 text-black pb-10">
      <Header title="समन्वयक डैशबोर्ड" subtitle="प्रबंधन केंद्र" onLogout={onLogout} />
      
      <div className="flex p-2 bg-white border-b-2 border-black overflow-x-auto gap-2 sticky top-[64px] z-40">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-shrink-0 px-6 py-3 rounded-2xl text-[10px] font-black uppercase transition-all border-2 ${activeTab === tab.id ? 'bg-black text-white border-black shadow-lg' : 'bg-white text-black border-black/10'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-4">
        {activeTab === 'view' && (
          <div className="space-y-4">
            {buses.length === 0 && (
               <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-black/10">
                  <p className="font-black text-gray-400">कोई बस रजिस्टर नहीं है।</p>
               </div>
            )}
            {buses.map(bus => (
              <Card key={bus.id} className={`p-6 border-2 border-black shadow-xl bg-white ${bus.isDisabled ? 'opacity-60' : ''}`}>
                <div className="flex justify-between items-start mb-6">
                   <div>
                      <h3 className="text-3xl font-black text-black">बस नं {bus.busNumber}</h3>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-tighter">{bus.routeHindi}</p>
                   </div>
                   <div className="flex flex-col gap-2">
                      <button 
                        onClick={() => setBuses(prev => prev.map(b => b.id === bus.id ? {...b, isDisabled: !b.isDisabled} : b))} 
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase border-2 transition-all ${bus.isDisabled ? 'bg-green-500 text-white border-green-700' : 'bg-red-500 text-white border-red-700'}`}
                      >
                        {bus.isDisabled ? 'चालू करें' : 'आज बंद करें'}
                      </button>
                      <button 
                        onClick={() => editingBusId === bus.id ? setEditingBusId(null) : startEditingDriver(bus)}
                        className="text-[9px] font-black bg-gray-100 px-3 py-2 rounded-lg border border-black/10 uppercase hover:bg-gray-200 transition-colors"
                      >
                        {editingBusId === bus.id ? 'रद्द करें' : 'एडिट चालक'}
                      </button>
                   </div>
                </div>

                {editingBusId === bus.id ? (
                  <div className="space-y-3 mb-6 p-4 bg-gray-50 rounded-2xl border-2 border-black/5 animate-in fade-in slide-in-from-top-2">
                    <div>
                      <label className="text-[9px] font-black text-gray-400 uppercase ml-1">चालक का नाम</label>
                      <input 
                        value={editDName} 
                        onChange={(e) => setEditDName(e.target.value)} 
                        placeholder="नाम" 
                        className="w-full p-3 border-2 border-black rounded-xl font-black text-black bg-white" 
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-black text-gray-400 uppercase ml-1">फ़ोन नंबर</label>
                      <input 
                        value={editDPhone} 
                        onChange={(e) => setEditDPhone(e.target.value)} 
                        placeholder="फोन" 
                        className="w-full p-3 border-2 border-black rounded-xl font-black text-black bg-white" 
                      />
                    </div>
                    <button onClick={() => saveDriverEdit(bus.id)} className="w-full bg-black text-white py-3 rounded-xl font-black uppercase text-xs shadow-lg active:scale-95 transition-all">सुरक्षित करें</button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-4 bg-gray-50 rounded-2xl border border-black/5">
                        <span className="text-[9px] font-black text-gray-400 uppercase block mb-1">चालक</span>
                        <span className="font-black text-black text-sm">{bus.driverNameHindi}</span>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl border border-black/5">
                        <span className="text-[9px] font-black text-gray-400 uppercase block mb-1">फ़ोन</span>
                        <span className="font-black text-black text-sm">{bus.driverContact}</span>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center mb-4">
                      <span className="text-[10px] font-black text-black uppercase">स्टॉप्स ({bus.stops.length})</span>
                      <button 
                        onClick={() => setAddingStopBusId(bus.id === addingStopBusId ? null : bus.id)} 
                        className="text-[10px] font-black bg-black text-white px-4 py-2 rounded-xl shadow-md uppercase active:scale-95 transition-all"
                      >
                        {addingStopBusId === bus.id ? 'रद्द करें' : '+ स्टॉप जोड़ें'}
                      </button>
                  </div>
                  
                  {addingStopBusId === bus.id && (
                    <div className="flex gap-2 mb-4 animate-in slide-in-from-top-2 duration-300">
                      <input 
                        autoFocus
                        value={newStopName} 
                        onChange={(e) => setNewStopName(e.target.value)} 
                        onKeyDown={(e) => e.key === 'Enter' && handleAddStopInline(bus.id)}
                        className="flex-1 p-3 border-2 border-black rounded-xl font-black text-black text-sm bg-white" 
                        placeholder="स्टॉप का नाम (जैसे: टेकरी)"
                      />
                      <button onClick={() => handleAddStopInline(bus.id)} className="bg-green-600 text-white px-6 rounded-xl font-black text-xs uppercase shadow-md active:scale-95 transition-all">OK</button>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                      {bus.stops.map(s => <span key={s.id} className="text-[10px] font-black bg-gray-100 border-2 border-black/10 px-3 py-1.5 rounded-lg text-black">{s.nameHindi}</span>)}
                      {bus.stops.length === 0 && !addingStopBusId && <p className="text-[10px] text-gray-400 font-bold italic">कोई स्टॉप नहीं है।</p>}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'add' && (
          <Card className="p-8 bg-white border-2 border-black shadow-2xl">
            <h3 className="text-2xl font-black mb-8 text-black uppercase tracking-tighter">नई बस जोड़ें</h3>
            <div className="space-y-5">
               <div>
                  <label className="text-[10px] font-black text-black uppercase mb-1 block">बस नंबर</label>
                  <input value={newBusNo} onChange={(e) => setNewBusNo(e.target.value)} className="w-full p-4 bg-gray-50 border-2 border-black rounded-3xl text-black font-black" placeholder="जैसे: 15" />
               </div>
               <div>
                  <label className="text-[10px] font-black text-black uppercase mb-1 block">चालक का नाम (हिंदी)</label>
                  <input value={newDriverHindi} onChange={(e) => setNewDriverHindi(e.target.value)} className="w-full p-4 bg-gray-50 border-2 border-black rounded-3xl text-black font-black" placeholder="नाम लिखें" />
               </div>
               <div>
                  <label className="text-[10px] font-black text-black uppercase mb-1 block">रूट (हिंदी)</label>
                  <input value={newRouteHindi} onChange={(e) => setNewRouteHindi(e.target.value)} className="w-full p-4 bg-gray-50 border-2 border-black rounded-3xl text-black font-black" placeholder="रूट लिखें" />
               </div>
               <div>
                  <label className="text-[10px] font-black text-black uppercase mb-1 block">स्टॉप सूची (कोमा से अलग करें)</label>
                  <textarea value={newStopsList} onChange={(e) => setNewStopsList(e.target.value)} className="w-full p-4 bg-gray-50 border-2 border-black rounded-3xl text-black font-black h-32" placeholder="उदा. बेदला, भुवाणा, टेकरी" />
               </div>
               <Button onClick={handleRegisterBus} className="bg-black text-white py-6 shadow-2xl !mt-6 text-xl tracking-widest border-b-4 border-gray-900">बस रजिस्टर करें</Button>
            </div>
          </Card>
        )}

        {activeTab === 'delete' && (
           <div className="space-y-3 pb-20">
              {buses.length === 0 && <p className="text-center py-10 font-black text-gray-400">कोई बस नहीं मिली।</p>}
              {buses.map(bus => (
                <Card key={bus.id} className="p-5 flex justify-between items-center border-2 border-black bg-white shadow-lg transition-all hover:translate-x-1">
                   <div>
                      <p className="font-black text-black text-2xl">बस {bus.busNumber}</p>
                      <p className="text-xs text-gray-400 font-black tracking-tighter uppercase">{bus.routeHindi}</p>
                   </div>
                   <button 
                     onClick={() => handleDeleteBus(bus.id)} 
                     className="bg-red-600 text-white px-8 py-4 rounded-2xl text-xs font-black uppercase shadow-xl border-b-4 border-red-900 hover:bg-red-700 active:scale-95 transition-all"
                   >
                      डिलीट
                   </button>
                </Card>
              ))}
           </div>
        )}

        {activeTab === 'drivers' && (
           <div className="space-y-8 pb-20">
              <Card className="p-8 bg-black text-white shadow-2xl rounded-[40px]">
                 <h4 className="text-xl font-black mb-6 uppercase">नया चालक जोड़ें</h4>
                 <div className="space-y-4">
                    <input 
                      value={newDName} 
                      onChange={(e) => setNewDName(e.target.value)} 
                      className="w-full p-5 bg-white border-2 border-white/20 rounded-3xl text-black font-black outline-none focus:ring-4 focus:ring-white/20" 
                      placeholder="नाम लिखें" 
                    />
                    <input 
                      value={newDPhone} 
                      onChange={(e) => setNewDPhone(e.target.value)} 
                      className="w-full p-5 bg-white border-2 border-white/20 rounded-3xl text-black font-black outline-none focus:ring-4 focus:ring-white/20" 
                      placeholder="फ़ोन नंबर" 
                    />
                    <Button onClick={() => {
                        if(!newDName || !newDPhone) return alert("विवरण भरें");
                        setDrivers([...drivers, { id: Date.now().toString(), name: newDName, nameHindi: newDName, phoneNumber: newDPhone }]);
                        setNewDName(''); setNewDPhone('');
                        alert("चालक सुरक्षित किया गया");
                    }} className="bg-white text-black font-black py-4 mt-4 shadow-xl active:scale-95 transition-all">सेव करें</Button>
                 </div>
              </Card>

              <div className="space-y-4">
                 <h3 className="font-black text-black text-xs uppercase ml-2 tracking-widest">चालक सूची ({drivers.length})</h3>
                 {drivers.map(d => (
                    <Card key={d.id} className="p-5 flex justify-between items-center bg-white border-2 border-black shadow-md">
                       <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-gray-100 border-2 border-black/5 rounded-2xl flex items-center justify-center font-black text-black text-xl shadow-inner">{d.nameHindi.charAt(0)}</div>
                          <div>
                             <p className="font-black text-black text-lg">{d.nameHindi}</p>
                             <p className="text-xs text-gray-500 font-black tracking-widest">{d.phoneNumber}</p>
                          </div>
                       </div>
                       <button onClick={() => setDrivers(drivers.filter(drv => drv.id !== d.id))} className="bg-red-50 text-red-600 p-3 rounded-2xl border-2 border-red-100 active:scale-90 transition-all hover:bg-red-100">
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                       </button>
                    </Card>
                 ))}
              </div>
           </div>
        )}
      </div>
    </div>
  );
};
