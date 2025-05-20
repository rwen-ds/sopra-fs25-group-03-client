// hooks/useGeolocation.ts
import { useState, useEffect } from 'react';

type Location = {
    latitude: number | null;
    longitude: number | null;
    error: string | null;
    timestamp?: number;
};

export const useGeolocation = (options?: PositionOptions) => {
    const [location, setLocation] = useState<Location>(() => {
        if (typeof window !== 'undefined') {
            const cached = localStorage.getItem('cachedLocation');
            if (cached) {
                const parsed = JSON.parse(cached);
                if (parsed.timestamp && Date.now() - parsed.timestamp < 60 * 60 * 1000) {
                    return parsed;
                }
            }
        }
        return { latitude: null, longitude: null, error: null };
    });

    useEffect(() => {
        if (!navigator.geolocation) {
            setLocation(prev => ({
                ...prev,
                error: 'Geolocation is not supported by your browser'
            }));
            return;
        }

        const geoOptions = {
            enableHighAccuracy: false,
            maximumAge: 60 * 60 * 1000,
            timeout: 10000,
            ...options
        };

        const handleSuccess = (position: GeolocationPosition) => {
            const newLocation = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                error: null,
                timestamp: Date.now()
            };
            setLocation(newLocation);
            localStorage.setItem('cachedLocation', JSON.stringify(newLocation));
        };

        const handleError = (error: GeolocationPositionError) => {
            setLocation(prev => ({
                ...prev,
                error: error.message
            }));
        };

        navigator.geolocation.getCurrentPosition(
            handleSuccess,
            handleError,
            geoOptions
        );
    }, [options]);

    return location;
};