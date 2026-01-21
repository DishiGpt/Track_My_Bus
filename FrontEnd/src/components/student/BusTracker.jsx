// src/components/student/BusTracker.jsx
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with webpack/vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom bus icon
const busIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/0/308.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
});

// Component to update map center when bus location changes
const MapUpdater = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.flyTo(center, 15, { duration: 1 });
        }
    }, [center, map]);
    return null;
};

const BusTracker = ({ buses }) => {
    const [selectedBus, setSelectedBus] = useState(null);
    const [busLocation, setBusLocation] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Default center (India)
    const defaultCenter = [20.5937, 78.9629];

    // Fetch bus location from backend every 10 seconds
    useEffect(() => {
        if (!selectedBus) {
            setBusLocation(null);
            return;
        }

        const fetchLocation = async () => {
            try {
                // Fetch fresh location from backend
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/bus/${selectedBus._id}/location`,
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        },
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    if (data.success && data.data) {
                        setBusLocation({
                            lat: data.data.latitude,
                            lng: data.data.longitude,
                        });
                        setLastUpdated(new Date());
                    }
                } else {
                    // Fallback to cached location if API fails
                    if (selectedBus.currentLocation) {
                        setBusLocation({
                            lat: selectedBus.currentLocation.latitude,
                            lng: selectedBus.currentLocation.longitude,
                        });
                        setLastUpdated(new Date(selectedBus.currentLocation.timestamp));
                    }
                }
            } catch (error) {
                console.error('Error fetching bus location:', error);
                // Use cached location on error
                if (selectedBus.currentLocation) {
                    setBusLocation({
                        lat: selectedBus.currentLocation.latitude,
                        lng: selectedBus.currentLocation.longitude,
                    });
                }
            }
        };

        // Initial fetch
        setIsLoading(true);
        fetchLocation().finally(() => setIsLoading(false));

        // Set up interval for real-time updates (every 10 seconds)
        const interval = setInterval(fetchLocation, 10000);

        return () => clearInterval(interval);
    }, [selectedBus]);

    if (buses.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-600 text-lg">No buses to track</p>
                <p className="text-gray-400 text-sm mt-2">Buses will appear here when available</p>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Track Your Bus</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Bus List - Left Side */}
                <div className="lg:col-span-1 space-y-3 max-h-[500px] overflow-y-auto">
                    <p className="text-gray-600 mb-2">Select a bus to track:</p>
                    {buses.map((bus) => (
                        <div
                            key={bus._id}
                            className={`p-4 rounded-lg border cursor-pointer transition ${selectedBus?._id === bus._id
                                ? 'bg-blue-50 border-blue-500 shadow-md'
                                : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
                                }`}
                            onClick={() => setSelectedBus(bus)}
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-lg">🚌 {bus.busNumber}</h3>
                                    <p className="text-sm text-gray-600">{bus.route?.name}</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Driver: {bus.driver?.name}
                                    </p>
                                </div>
                                <div className="text-right">
                                    {bus.currentLocation ? (
                                        <span className="text-green-600 text-xs flex items-center gap-1">
                                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                            Live
                                        </span>
                                    ) : (
                                        <span className="text-gray-400 text-xs">Offline</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Map - Right Side */}
                <div className="lg:col-span-2">
                    <div className="bg-gray-100 rounded-lg overflow-hidden border" style={{ height: '500px' }}>
                        {selectedBus ? (
                            <>
                                {/* Map Header */}
                                <div className="bg-blue-600 text-white p-3 flex justify-between items-center">
                                    <div>
                                        <span className="font-bold">Tracking: {selectedBus.busNumber}</span>
                                        <span className="text-blue-200 text-sm ml-2">
                                            ({selectedBus.route?.name})
                                        </span>
                                    </div>
                                    {lastUpdated && (
                                        <span className="text-xs text-blue-200">
                                            Updated: {lastUpdated.toLocaleTimeString()}
                                        </span>
                                    )}
                                </div>

                                {/* Map Container */}
                                <MapContainer
                                    center={busLocation ? [busLocation.lat, busLocation.lng] : defaultCenter}
                                    zoom={busLocation ? 15 : 5}
                                    style={{ height: 'calc(100% - 52px)', width: '100%' }}
                                >
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />

                                    {busLocation && (
                                        <>
                                            <Marker
                                                position={[busLocation.lat, busLocation.lng]}
                                                icon={busIcon}
                                            >
                                                <Popup>
                                                    <div className="text-center">
                                                        <strong>🚌 {selectedBus.busNumber}</strong>
                                                        <br />
                                                        <span className="text-gray-600">{selectedBus.route?.name}</span>
                                                        <br />
                                                        <span className="text-xs text-gray-500">
                                                            Driver: {selectedBus.driver?.name}
                                                        </span>
                                                    </div>
                                                </Popup>
                                            </Marker>
                                            <MapUpdater center={[busLocation.lat, busLocation.lng]} />
                                        </>
                                    )}
                                </MapContainer>

                                {/* Location Info */}
                                {!busLocation && (
                                    <div className="absolute inset-0 bg-gray-100 bg-opacity-90 flex items-center justify-center" style={{ marginTop: '52px' }}>
                                        <div className="text-center">
                                            <p className="text-gray-600 text-lg">📍 Location Not Available</p>
                                            <p className="text-gray-400 text-sm mt-2">
                                                Driver hasn't started sharing location yet
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="h-full flex items-center justify-center">
                                <div className="text-center">
                                    <p className="text-gray-500 text-5xl mb-4">🗺️</p>
                                    <p className="text-gray-600 text-lg">Select a bus from the list</p>
                                    <p className="text-gray-400 text-sm mt-2">
                                        to see its live location on the map
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Bus Details Panel */}
                    {selectedBus && (
                        <div className="mt-4 bg-gray-50 p-4 rounded-lg border">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <p className="text-xs text-gray-500">Bus Number</p>
                                    <p className="font-bold">{selectedBus.busNumber}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Driver</p>
                                    <p className="font-medium">{selectedBus.driver?.name}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Departure</p>
                                    <p className="font-medium">{selectedBus.departureTime}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Status</p>
                                    <p className={`font-medium ${busLocation ? 'text-green-600' : 'text-gray-500'}`}>
                                        {busLocation ? '🟢 On Route' : '⚪ Not Started'}
                                    </p>
                                </div>
                            </div>
                            {busLocation && (
                                <div className="mt-3 pt-3 border-t text-sm text-gray-600">
                                    <span className="font-medium">Coordinates:</span>{' '}
                                    {busLocation.lat.toFixed(6)}, {busLocation.lng.toFixed(6)}
                                    <span className="text-gray-400 ml-2">(updates every 10 seconds)</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BusTracker;
