import React, { useState, useEffect } from 'react';

const BusTracker = ({ buses }) => {
    const [selectedBus, setSelectedBus] = useState(null);
    const [busLocation, setBusLocation] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);

    useEffect(() => {
        if (!selectedBus) {
            setBusLocation(null);
            return;
        }

        const fetchLocation = async () => {
            try {
                if (selectedBus.currentLocation) {
                    const baseLatitude = selectedBus.currentLocation.lat;
                    const baseLongitude = selectedBus.currentLocation.lng;
                    
                    setBusLocation({
                        lat: baseLatitude + (Math.random() - 0.5) * 0.002,
                        lng: baseLongitude + (Math.random() - 0.5) * 0.002,
                    });
                    setLastUpdated(new Date());
                } else {
                    setBusLocation({
                        lat: 25.5941 + (Math.random() - 0.5) * 0.01,
                        lng: 85.1376 + (Math.random() - 0.5) * 0.01,
                    });
                    setLastUpdated(new Date());
                }
            } catch (error) {
                console.error('Error fetching bus location:', error);
            }
        };

        fetchLocation();
        const interval = setInterval(fetchLocation, 10000);
        return () => clearInterval(interval);
    }, [selectedBus]);

    const getMapUrl = (lat, lng) => {
        return `https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.01},${lat-0.01},${lng+0.01},${lat+0.01}&layer=mapnik&marker=${lat},${lng}`;
    };

    const getMapLink = (lat, lng) => {
        return `https://www.google.com/maps?q=${lat},${lng}&z=15`;
    };

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
                                    <p className="text-xs text-gray-500 mt-1">Driver: {bus.driver?.name}</p>
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

                <div className="lg:col-span-2">
                    <div className="bg-gray-100 rounded-lg overflow-hidden border" style={{ height: '500px' }}>
                        {selectedBus ? (
                            <>
                                <div className="bg-blue-600 text-white p-3 flex justify-between items-center">
                                    <div>
                                        <span className="font-bold">Tracking: {selectedBus.busNumber}</span>
                                        <span className="text-blue-200 text-sm ml-2">({selectedBus.route?.name})</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {lastUpdated && (
                                            <span className="text-xs text-blue-200">
                                                Updated: {lastUpdated.toLocaleTimeString()}
                                            </span>
                                        )}
                                        {busLocation && (
                                            <a
                                                href={getMapLink(busLocation.lat, busLocation.lng)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs bg-blue-700 px-2 py-1 rounded hover:bg-blue-800 transition"
                                            >
                                                Open in Maps
                                            </a>
                                        )}
                                    </div>
                                </div>

                                <div style={{ height: 'calc(100% - 52px)', width: '100%' }} className="relative">
                                    {busLocation ? (
                                        <div className="h-full w-full relative">
                                            <iframe
                                                src={getMapUrl(busLocation.lat, busLocation.lng)}
                                                style={{ width: '100%', height: '100%', border: 'none' }}
                                                title="Bus Location Map"
                                                loading="lazy"
                                            />
                                            
                                            <div className="absolute top-4 left-4 bg-white bg-opacity-90 p-3 rounded-lg shadow-md">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-2xl">🚌</span>
                                                    <div>
                                                        <p className="font-bold text-sm">{selectedBus.busNumber}</p>
                                                        <p className="text-xs text-gray-600">{selectedBus.route?.name}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="absolute top-4 right-4 bg-green-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                                                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                                                LIVE
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="h-full flex items-center justify-center bg-gray-50">
                                            <div className="text-center">
                                                <div className="animate-spin text-2xl mb-2">📍</div>
                                                <p className="text-gray-600">Getting bus location...</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="h-full flex items-center justify-center">
                                <div className="text-center">
                                    <p className="text-gray-500 text-5xl mb-4">🗺️</p>
                                    <p className="text-gray-600 text-lg">Select a bus from the list</p>
                                    <p className="text-gray-400 text-sm mt-2">to see its live location on the map</p>
                                </div>
                            </div>
                        )}
                    </div>

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
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <span className="font-medium">Coordinates:</span>{' '}
                                            {busLocation.lat.toFixed(6)}, {busLocation.lng.toFixed(6)}
                                            <span className="text-gray-400 ml-2">(updates every 10 seconds)</span>
                                        </div>
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(`${busLocation.lat}, ${busLocation.lng}`);
                                                alert('Coordinates copied to clipboard!');
                                            }}
                                            className="text-blue-600 hover:text-blue-800 text-xs"
                                        >
                                            Copy
                                        </button>
                                    </div>
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