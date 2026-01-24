import React, { useState, useEffect } from 'react';

const BusTracker = ({ buses }) => {
    const [selectedBus, setSelectedBus] = useState(null);
    const [busLocation, setBusLocation] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!selectedBus) {
            setBusLocation(null);
            return;
        }

        const fetchLocation = async () => {
            try {
                const token = localStorage.getItem('token');
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

                const response = await fetch(`${apiUrl}/bus/${selectedBus._id}/location`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.success && data.data && data.data.latitude && data.data.longitude) {
                        setBusLocation({
                            lat: data.data.latitude,
                            lng: data.data.longitude,
                        });
                        setLastUpdated(new Date());
                    }
                } else {
                    if (selectedBus.currentLocation) {
                        setBusLocation({
                            lat: selectedBus.currentLocation.latitude || selectedBus.currentLocation.lat,
                            lng: selectedBus.currentLocation.longitude || selectedBus.currentLocation.lng,
                        });
                        setLastUpdated(new Date());
                    }
                }
            } catch (error) {
                console.error('Error fetching bus location:', error);
                if (selectedBus.currentLocation) {
                    setBusLocation({
                        lat: selectedBus.currentLocation.latitude || selectedBus.currentLocation.lat,
                        lng: selectedBus.currentLocation.longitude || selectedBus.currentLocation.lng,
                    });
                }
            }
        };

        setIsLoading(true);
        fetchLocation().finally(() => setIsLoading(false));

        const interval = setInterval(fetchLocation, 10000);
        return () => clearInterval(interval);
    }, [selectedBus]);

    const getMapUrl = (lat, lng) => {
        return `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01},${lat - 0.01},${lng + 0.01},${lat + 0.01}&layer=mapnik&marker=${lat},${lng}`;
    };

    const openInMaps = (lat, lng) => {
        window.open(`https://www.google.com/maps?q=${lat},${lng}&z=15`, '_blank');
    };

    if (buses.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <span className="text-5xl mb-4">🗺️</span>
                <p className="text-gray-600 font-medium">No buses to track</p>
                <p className="text-gray-400 text-sm mt-1">Buses will appear here when available</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            {/* Bus Selector - Horizontal Scroll on Mobile */}
            {!selectedBus && (
                <div className="p-4">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Select a Bus to Track</h2>
                    <div className="space-y-3">
                        {buses.map((bus) => (
                            <div
                                key={bus._id}
                                onClick={() => setSelectedBus(bus)}
                                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 active:bg-gray-50 transition-all touch-manipulation cursor-pointer"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                            <span className="text-2xl">🚌</span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg">{bus.busNumber}</h3>
                                            <p className="text-sm text-gray-500">{bus.route?.name}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {bus.currentLocation ? (
                                            <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                                Live
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs font-medium">
                                                Offline
                                            </span>
                                        )}
                                        <span className="text-gray-400">→</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Map View - Full Screen on Mobile */}
            {selectedBus && (
                <div className="flex-1 flex flex-col">
                    {/* Map Header */}
                    <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setSelectedBus(null)}
                                className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center active:bg-white/30 touch-manipulation"
                            >
                                ←
                            </button>
                            <div>
                                <p className="font-bold">{selectedBus.busNumber}</p>
                                <p className="text-xs text-blue-200">{selectedBus.route?.name}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {busLocation && (
                                <span className="inline-flex items-center gap-1 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                                    LIVE
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Map Container */}
                    <div className="flex-1 relative bg-gray-100">
                        {isLoading ? (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                    <p className="text-gray-600">Getting location...</p>
                                </div>
                            </div>
                        ) : busLocation ? (
                            <>
                                <iframe
                                    src={getMapUrl(busLocation.lat, busLocation.lng)}
                                    className="w-full h-full border-none"
                                    title="Bus Location Map"
                                    loading="lazy"
                                />
                                {/* Floating Info Card */}
                                <div className="absolute bottom-4 left-4 right-4 bg-white rounded-2xl shadow-lg p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl">📍</span>
                                            <div>
                                                <p className="font-bold">{selectedBus.busNumber}</p>
                                                <p className="text-xs text-gray-500">
                                                    Driver: {selectedBus.driver?.name || 'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                        {lastUpdated && (
                                            <p className="text-xs text-gray-400">
                                                {lastUpdated.toLocaleTimeString()}
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => openInMaps(busLocation.lat, busLocation.lng)}
                                        className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold active:bg-blue-700 transition-all touch-manipulation"
                                    >
                                        Open in Google Maps
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center px-8">
                                    <span className="text-5xl mb-4 block">⚪</span>
                                    <p className="text-gray-600 font-medium">Bus location unavailable</p>
                                    <p className="text-gray-400 text-sm mt-1">The driver hasn't started sharing location yet</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default BusTracker;
