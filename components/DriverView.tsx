
import React, { useState } from 'react';
// Import Bus type from types and use buses prop instead of the non-existent MOCK_BUSES export
import { Bus } from '../types';
import { Header, Card, Button } from './Shared';

interface DriverViewProps {
  onLogout: () => void;
  buses: Bus[];
}

// Updated DriverView to accept buses as a prop to ensure it stays in sync with coordinator updates
export const DriverView: React.FC<DriverViewProps> = ({ onLogout, buses }) => {
  const [selectedBusId, setSelectedBusId] = useState<string>('');
  const [isGpsEnabled, setIsGpsEnabled] = useState(false);
  // Use the buses prop instead of MOCK_BUSES
  const bus = buses.find(b => b.id === selectedBusId);

  return (
    <div className="min-h-screen bg-white">
      <Header title="ड्राइवर कंसोल" subtitle="Track My Bus" onLogout={onLogout} />
      
      <div className="p-5 space-y-6">
        <Card className="p-6 border-none bg-indigo-50 shadow-inner">
           <label className="block text-sm font-black text-indigo-800 mb-3 uppercase">बस नंबर चुनें</label>
           <select 
            className="w-full p-4 bg-white border-2 border-indigo-100 rounded-2xl font-black text-xl text-center outline-none text-gray-900"
            value={selectedBusId}
            onChange={(e) => {
              setSelectedBusId(e.target.value);
              setIsGpsEnabled(false);
            }}
          >
            <option value="">नंबर चुनें</option>
            {buses.map(b => (
              <option key={b.id} value={b.id}>{b.busNumber}</option>
            ))}
          </select>

          {selectedBusId && (
            <div className="mt-8 space-y-4">
              <Button 
                onClick={() => setIsGpsEnabled(!isGpsEnabled)}
                className={`py-6 text-xl shadow-lg border-b-4 ${isGpsEnabled ? 'bg-red-600 border-red-800' : 'bg-green-600 border-green-800'} text-white`}
              >
                {isGpsEnabled ? 'जीपीएस बंद करें' : 'जीपीएस चालू करें'}
              </Button>
              <div className="flex items-center justify-center gap-2">
                 <div className={`w-3 h-3 rounded-full ${isGpsEnabled ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
                 <span className="text-xs font-bold text-gray-500">{isGpsEnabled ? 'लोकेशन ट्रैक की जा रही है' : 'ट्रैकिंग बंद है'}</span>
              </div>
            </div>
          )}
        </Card>

        {bus && (
          <div className="animate-in fade-in duration-500">
             <h3 className="text-lg font-black text-gray-800 mb-4 px-2">सभी बस स्टॉप</h3>
             <div className="space-y-3">
                {bus.stops.map((stop, i) => (
                  <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-4 shadow-sm">
                    <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold">{i+1}</div>
                    <span className="font-bold text-gray-900">{stop.nameHindi}</span>
                  </div>
                ))}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};
