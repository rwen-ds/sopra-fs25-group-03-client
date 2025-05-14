// hooks/useGeolocation.ts
import { useState, useEffect } from 'react';

export const useGeolocation = () => {
    const [location, setLocation] = useState<{
        latitude: number | null;
        longitude: number | null;
        error: string | null;
    }>({
        latitude: null,
        longitude: null,
        error: null
    });

    useEffect(() => {
        if (!navigator.geolocation) {
            setLocation(prev => ({
                ...prev,
                error: 'Geolocation is not supported by your browser'
            }));
            return;
        }

        const handleSuccess = (position: GeolocationPosition) => {
            setLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                error: null
            });
        };

        const handleError = (error: GeolocationPositionError) => {
            setLocation(prev => ({
                ...prev,
                error: error.message
            }));
        };

        navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
    }, []);

    return location;
};