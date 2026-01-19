import React, { useState, useEffect } from 'react';
import { Header, Card, Button } from './Shared';
import api from '../src/api/axios';

export const DriverView = ({ onLogout, currentUser }) => {
  const [bus, setBus] = useState(null);
  const [isGpsEnabled, setIsGpsEnabled] = useState(false);
  const [lang, setLang] = useState('hi'); // Default Hindi as per cached view

  const t = {
    hi: {
      title: "ड्राइवर कंसोल",
      selectBus: "बस नंबर चुनें",
      startGps: "जीपीएस चालू करें",
      stopGps: "जीपीएस बंद करें",
      trackingOn: "लोकेशन ट्रैक की जा रही है",
      trackingOff: "ट्रैकिंग बंद है",
      allStops: "सभी बस स्टॉप",
      assignedBus: "आपकी निर्धारित बस",
      noBus: "कोई बस निर्धारित नहीं है"
    },
    en: {
      title: "Driver Console",
      selectBus: "Select Bus Number",
      startGps: "Start GPS",
      stopGps: "Stop GPS",
      trackingOn: "Location Tracking ON",
      trackingOff: "Tracking OFF",
      allStops: "All Bus Stops",
      assignedBus: "Assigned Bus",
      noBus: "No Bus Assigned"
    }
  };

  useEffect(() => {
    const fetchDriverData = async () => {
      try {
        if (currentUser?._id) {
          const res = await api.get(`/driver/me/${currentUser._id}`);
          if (res.data.assignedBus) {
            // If populated, use it. If ID, fetch bus. 
            // auth.js login returns user. assignedBus is ObjectId ref.
            // driver.js me route populates assignedBus.
            setBus(res.data.assignedBus);
            setIsGpsEnabled(res.data.assignedBus.isLive || false);
          }
        }
      } catch (err) {
        console.error("Error fetching driver data:", err);
      }
    };
    fetchDriverData();
  }, [currentUser]);

  const toggleGps = async () => {
    if (!bus) return;
    const newState = !isGpsEnabled;
    setIsGpsEnabled(newState);

    // Determine Mock Location or Real Geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        await updateLocation(pos.coords.latitude, pos.coords.longitude, newState);
      }, (err) => {
        console.error("Geolocation error", err);
        // Fallback or alert
        // Sending dummy update for state change
        updateLocation(24.5854, 73.7125, newState);
      });
    } else {
      updateLocation(24.5854, 73.7125, newState);
    }
  };

  const updateLocation = async (lat, lng, status) => {
    try {
      await api.post('/driver/location', {
        busId: bus._id,
        lat,
        lng,
        isGpsActive: status
      });
    } catch (err) {
      console.error("Error updating location:", err);
    }
  };

  // Mock location interval if GPS is on (in real app, background service)
  useEffect(() => {
    let interval;
    if (isGpsEnabled && bus) {
      interval = setInterval(() => {
        // Verify if browser geolocation is available
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((pos) => {
            updateLocation(pos.coords.latitude, pos.coords.longitude, true);
          });
        }
      }, 10000); // 10 seconds
    }
    return () => clearInterval(interval);
  }, [isGpsEnabled, bus]);

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-black text-white p-4 flex justify-between items-center shadow-md">
        <div>
          <h1 className="text-xl font-black uppercase tracking-tighter">{t[lang].title}</h1>
          <p className="text-xs opacity-60">Track My Bus</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setLang(lang === 'hi' ? 'en' : 'hi')} className="bg-white/20 px-3 py-1 rounded font-bold text-xs uppercase border border-white/10">
            {lang === 'hi' ? 'ENG' : 'हिंदी'}
          </button>
          <button onClick={onLogout} className="bg-red-600 px-3 py-1 rounded font-bold text-xs uppercase">Logout</button>
        </div>
      </div>

      <div className="p-5 space-y-6">
        <Card className="p-6 border-none bg-indigo-50 shadow-inner">
          <label className="block text-sm font-black text-indigo-800 mb-3 uppercase">{t[lang].assignedBus}</label>

          {bus ? (
            <div className="text-center mb-6">
              <p className="text-4xl font-black text-black">{bus.busNumber}</p>
              <p className="text-gray-500 font-bold">{bus.route}</p>
            </div>
          ) : (
            <p className="text-center font-bold text-gray-400 py-4">{t[lang].noBus}</p>
          )}

          {bus && (
            <div className="space-y-4">
              <Button
                onClick={toggleGps}
                className={`py-6 text-xl shadow-lg border-b-4 ${isGpsEnabled ? 'bg-red-600 border-red-800' : 'bg-green-600 border-green-800'} text-white`}
              >
                {isGpsEnabled ? t[lang].stopGps : t[lang].startGps}
              </Button>
              <div className="flex items-center justify-center gap-2">
                <div className={`w-3 h-3 rounded-full ${isGpsEnabled ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
                <span className="text-xs font-bold text-gray-500">{isGpsEnabled ? t[lang].trackingOn : t[lang].trackingOff}</span>
              </div>
            </div>
          )}
        </Card>

        {bus && (
          <div className="animate-in fade-in duration-500">
            <h3 className="text-lg font-black text-gray-800 mb-4 px-2">{t[lang].allStops}</h3>
            <div className="space-y-3">
              {/* Mocking stops if bus doesn't have them populated from route yet, or use what's available */}
              {/* If Route model has stops, we might need to populate 'stops' or fetch route details */}
              {/* For now, assuming bus.stops might be empty if backend is simple. Mocking for display if empty */}
              {(bus.stops || []).length === 0 && (
                <div className="p-4 text-center text-gray-400 font-bold text-sm bg-gray-50 rounded-2xl">
                  Feature coming soon: Stops List
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
