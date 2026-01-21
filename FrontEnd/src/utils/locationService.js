// src/utils/locationService.js
import { Geolocation } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';
import { busAPI } from './api';

class LocationService {
    constructor() {
        this.watchId = null;
        this.intervalId = null;
        this.isTracking = false;
        this.lastLocation = null;
        this.updateInterval = 10000; // 10 seconds
    }

    // Check if running on native platform (Android/iOS)
    isNative() {
        return Capacitor.isNativePlatform();
    }

    // Request location permissions
    async requestPermissions() {
        try {
            if (this.isNative()) {
                const status = await Geolocation.requestPermissions();
                return status.location === 'granted';
            } else {
                // For web, use navigator.geolocation
                return new Promise((resolve) => {
                    navigator.geolocation.getCurrentPosition(
                        () => resolve(true),
                        () => resolve(false)
                    );
                });
            }
        } catch (error) {
            console.error('Error requesting permissions:', error);
            return false;
        }
    }

    // Check if permissions are granted
    async checkPermissions() {
        try {
            if (this.isNative()) {
                const status = await Geolocation.checkPermissions();
                return status.location === 'granted';
            }
            return true; // Web always returns true, will prompt when needed
        } catch (error) {
            console.error('Error checking permissions:', error);
            return false;
        }
    }

    // Get current position once
    async getCurrentPosition() {
        try {
            if (this.isNative()) {
                const position = await Geolocation.getCurrentPosition({
                    enableHighAccuracy: true,
                    timeout: 10000,
                });
                return {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    timestamp: position.timestamp,
                };
            } else {
                // Web fallback
                return new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            resolve({
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude,
                                accuracy: position.coords.accuracy,
                                timestamp: position.timestamp,
                            });
                        },
                        (error) => reject(error),
                        { enableHighAccuracy: true, timeout: 10000 }
                    );
                });
            }
        } catch (error) {
            console.error('Error getting current position:', error);
            throw error;
        }
    }

    // Start continuous location tracking
    async startTracking(onLocationUpdate, onError) {
        if (this.isTracking) {
            console.log('Already tracking location');
            return;
        }

        const hasPermission = await this.requestPermissions();
        if (!hasPermission) {
            onError?.('Location permission denied');
            return;
        }

        this.isTracking = true;

        try {
            if (this.isNative()) {
                // Use Capacitor watchPosition for native
                this.watchId = await Geolocation.watchPosition(
                    {
                        enableHighAccuracy: true,
                        timeout: 10000,
                        maximumAge: 0,
                    },
                    (position, error) => {
                        if (error) {
                            console.error('Watch position error:', error);
                            onError?.(error.message);
                            return;
                        }

                        if (position) {
                            const location = {
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude,
                                accuracy: position.coords.accuracy,
                                timestamp: position.timestamp,
                            };
                            this.lastLocation = location;
                            onLocationUpdate?.(location);
                        }
                    }
                );

                // Also set up interval to send to backend
                this.intervalId = setInterval(async () => {
                    if (this.lastLocation) {
                        await this.sendLocationToBackend(this.lastLocation);
                    }
                }, this.updateInterval);

            } else {
                // Web fallback with interval
                const sendLocation = async () => {
                    try {
                        const position = await this.getCurrentPosition();
                        this.lastLocation = position;
                        onLocationUpdate?.(position);
                        await this.sendLocationToBackend(position);
                    } catch (error) {
                        console.error('Error in web tracking:', error);
                        onError?.(error.message);
                    }
                };

                // Initial location
                await sendLocation();

                // Set up interval
                this.intervalId = setInterval(sendLocation, this.updateInterval);
            }

            console.log('Location tracking started');
        } catch (error) {
            console.error('Error starting tracking:', error);
            this.isTracking = false;
            onError?.(error.message);
        }
    }

    // Stop location tracking
    async stopTracking() {
        if (!this.isTracking) {
            return;
        }

        try {
            if (this.watchId !== null && this.isNative()) {
                await Geolocation.clearWatch({ id: this.watchId });
                this.watchId = null;
            }

            if (this.intervalId) {
                clearInterval(this.intervalId);
                this.intervalId = null;
            }

            this.isTracking = false;
            this.lastLocation = null;
            console.log('Location tracking stopped');
        } catch (error) {
            console.error('Error stopping tracking:', error);
        }
    }

    // Send location to backend
    async sendLocationToBackend(location) {
        try {
            await busAPI.updateLocation(location.latitude, location.longitude);
            console.log('Location sent to backend:', location.latitude, location.longitude);
            return true;
        } catch (error) {
            console.error('Error sending location to backend:', error);
            return false;
        }
    }

    // Get tracking status
    getStatus() {
        return {
            isTracking: this.isTracking,
            lastLocation: this.lastLocation,
        };
    }
}

// Export singleton instance
export const locationService = new LocationService();
export default locationService;
