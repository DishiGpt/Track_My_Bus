import React, { useState, useEffect } from 'react';
import { Header, Card, Button } from './Shared';
import api from '../src/api/axios';

export const CoordinatorView = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('view');
  const [buses, setBuses] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);

  // New Bus State
  const [newBusNo, setNewBusNo] = useState('');
  const [newRoute, setNewRoute] = useState('');
  const [newCapacity, setNewCapacity] = useState('');

  // New Driver State
  const [newDName, setNewDName] = useState('');
  const [newDPhone, setNewDPhone] = useState('');
  const [newDAssignedBus, setNewDAssignedBus] = useState('');

  // Editing State
  const [editingDriverId, setEditingDriverId] = useState(null);
  const [editDName, setEditDName] = useState('');
  const [editDAssignedBus, setEditDAssignedBus] = useState('');

  const fetchBuses = async () => {
    try {
      const res = await api.get('/coordinator/buses');
      setBuses(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchDrivers = async () => {
    try {
      const res = await api.get('/coordinator/drivers');
      setDrivers(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    if (activeTab === 'view' || activeTab === 'delete' || activeTab === 'add') fetchBuses();
    if (activeTab === 'drivers') {
      fetchDrivers();
      fetchBuses(); // Needed for dropdown assignment
    }
  }, [activeTab]);

  const handleRegisterBus = async () => {
    if (!newBusNo || !newRoute) return alert("कृपया सभी विवरण भरें!");
    try {
      await api.post('/coordinator/bus', {
        busNumber: newBusNo,
        route: newRoute,
        capacity: newCapacity || 40
      });
      alert("नई बस सफलतापूर्वक रजिस्टर की गई!");
      setNewBusNo(''); setNewRoute(''); setNewCapacity('');
      setActiveTab('view');
    } catch (err) {
      alert('Error adding bus: ' + err.response?.data?.error || err.message);
    }
  };

  const handleDeleteBus = async (id) => {
    if (confirm("चेतावनी: क्या आप वाकई इस बस को सिस्टम से हमेशा के लिए हटाना चाहते हैं?")) {
      try {
        await api.delete(`/coordinator/bus/${id}`);
        alert("सफलता: बस को हटा दिया गया है।");
        fetchBuses();
      } catch (err) {
        alert('Error deleting bus');
      }
    }
  };

  const handleToggleBusStatus = async (bus) => {
    try {
      await api.patch(`/coordinator/bus/${bus._id}`, { isDisabled: !bus.isDisabled });
      fetchBuses();
    } catch (err) { console.error(err); }
  };

  const handleAddDriver = async () => {
    if (!newDName || !newDPhone) return alert("विवरण भरें");
    try {
      await api.post('/coordinator/driver', {
        name: newDName,
        phoneNumber: newDPhone,
        assignedBusId: newDAssignedBus || null
      });
      alert("चालक सुरक्षित किया गया");
      setNewDName(''); setNewDPhone(''); setNewDAssignedBus('');
      fetchDrivers();
    } catch (err) {
      alert('Error adding driver: ' + err.response?.data?.error);
    }
  };

  // Driver Edit
  const startEditingDriver = (driver) => {
    setEditingDriverId(driver._id);
    setEditDName(driver.name);
    setEditDAssignedBus(driver.assignedBus?._id || '');
  };

  const saveDriverEdit = async () => {
    try {
      await api.put(`/coordinator/driver/${editingDriverId}`, {
        name: editDName,
        assignedBusId: editDAssignedBus || null
      });
      setEditingDriverId(null);
      fetchDrivers();
      alert("Update Successful");
    } catch (err) {
      alert('Error updating driver');
    }
  };

  const tabs = [
    { id: 'view', label: 'बसें देखें' },
    { id: 'add', label: 'नई बस' },
    { id: 'drivers', label: 'चालक' },
    { id: 'delete', label: 'हटाएं' }
  ];

  return (
    <div className="min-h-screen bg-gray-100 text-black pb-10">
      <Header title="समन्वयक डैशबोर्ड" subtitle="प्रबंधन केंद्र" onLogout={onLogout} />

      <div className="flex p-2 bg-white border-b-2 border-black overflow-x-auto gap-2 sticky top-[64px] z-40">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
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
              <Card key={bus._id} className={`p-6 border-2 border-black shadow-xl bg-white ${bus.isDisabled ? 'opacity-60' : ''}`}>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-3xl font-black text-black">बस नं {bus.busNumber}</h3>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-tighter">{bus.route}</p>
                    <p className="text-[10px] uppercase font-bold text-blue-600 mt-1">Driver: {bus.driverName || 'None'}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleToggleBusStatus(bus)}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase border-2 transition-all ${!bus.isDisabled ? 'bg-red-500 text-white border-red-700' : 'bg-green-500 text-white border-green-700'}`}
                    >
                      {bus.isDisabled ? 'चालू करें' : 'आज बंद करें'}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-2">
                  <div className="p-4 bg-gray-50 rounded-2xl border border-black/5">
                    <span className="text-[9px] font-black text-gray-400 uppercase block mb-1">Live Status</span>
                    <span className={`font-black text-sm ${bus.isLive ? 'text-green-600' : 'text-gray-400'}`}>{bus.isLive ? 'ONLINE' : 'OFFLINE'}</span>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl border border-black/5">
                    <span className="text-[9px] font-black text-gray-400 uppercase block mb-1">Capacity</span>
                    <span className="font-black text-black text-sm">{bus.capacity}</span>
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
                <label className="text-[10px] font-black text-black uppercase mb-1 block">रूट</label>
                <input value={newRoute} onChange={(e) => setNewRoute(e.target.value)} className="w-full p-4 bg-gray-50 border-2 border-black rounded-3xl text-black font-black" placeholder="रूट लिखें" />
              </div>
              <div>
                <label className="text-[10px] font-black text-black uppercase mb-1 block">क्षमता</label>
                <input value={newCapacity} onChange={(e) => setNewCapacity(e.target.value)} className="w-full p-4 bg-gray-50 border-2 border-black rounded-3xl text-black font-black" placeholder="40" type="number" />
              </div>
              <Button onClick={handleRegisterBus} className="bg-black text-white py-6 shadow-2xl !mt-6 text-xl tracking-widest border-b-4 border-gray-900">बस रजिस्टर करें</Button>
            </div>
          </Card>
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
                  placeholder="फ़ोन नंबर (Login ID)"
                />
                <select
                  value={newDAssignedBus}
                  onChange={(e) => setNewDAssignedBus(e.target.value)}
                  className="w-full p-5 bg-white border-2 border-white/20 rounded-3xl text-black font-black outline-none"
                >
                  <option value="">कोई बस नहीं (बाद में चुनें)</option>
                  {buses.map(b => (
                    <option key={b._id} value={b._id}>Bus {b.busNumber} ({b.route})</option>
                  ))}
                </select>
                <Button onClick={handleAddDriver} className="bg-white text-black font-black py-4 mt-4 shadow-xl active:scale-95 transition-all">सेव करें</Button>
              </div>
            </Card>

            <div className="space-y-4">
              <h3 className="font-black text-black text-xs uppercase ml-2 tracking-widest">चालक सूची ({drivers.length})</h3>
              {drivers.map(d => (
                <Card key={d._id} className="p-5 bg-white border-2 border-black shadow-md">
                  {editingDriverId === d._id ? (
                    <div className="space-y-3">
                      <input value={editDName} onChange={e => setEditDName(e.target.value)} className="w-full p-2 border border-black rounded" />
                      <select value={editDAssignedBus} onChange={e => setEditDAssignedBus(e.target.value)} className="w-full p-2 border border-black rounded">
                        <option value="">No Bus</option>
                        {buses.map(b => <option key={b._id} value={b._id}>{b.busNumber}</option>)}
                      </select>
                      <div className="flex gap-2">
                        <button onClick={saveDriverEdit} className="bg-black text-white px-3 py-1 rounded">Save</button>
                        <button onClick={() => setEditingDriverId(null)} className="bg-gray-200 px-3 py-1 rounded">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gray-100 border-2 border-black/5 rounded-2xl flex items-center justify-center font-black text-black text-xl shadow-inner">{d.name?.charAt(0)}</div>
                        <div>
                          <p className="font-black text-black text-lg">{d.name}</p>
                          <p className="text-xs text-gray-500 font-black tracking-widest">{d.phoneNumber}</p>
                          <p className="text-xs text-blue-600 font-bold">Bus: {d.assignedBus?.busNumber || 'None'}</p>
                        </div>
                      </div>
                      <button onClick={() => startEditingDriver(d)} className="bg-gray-100 px-3 py-1 rounded text-xs font-bold">Edit</button>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'delete' && (
          <div className="space-y-3 pb-20">
            {buses.map(bus => (
              <Card key={bus._id} className="p-5 flex justify-between items-center border-2 border-black bg-white shadow-lg transition-all hover:translate-x-1">
                <div>
                  <p className="font-black text-black text-2xl">बस {bus.busNumber}</p>
                  <p className="text-xs text-gray-400 font-black tracking-tighter uppercase">{bus.route}</p>
                </div>
                <button
                  onClick={() => handleDeleteBus(bus._id)}
                  className="bg-red-600 text-white px-8 py-4 rounded-2xl text-xs font-black uppercase shadow-xl border-b-4 border-red-900 hover:bg-red-700 active:scale-95 transition-all"
                >
                  डिलीट
                </button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
