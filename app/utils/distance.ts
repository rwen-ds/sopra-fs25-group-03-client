// utils/distance.ts
export const calculateDistance = (
    lat1: number | null,
    lon1: number | null,
    lat2: number | null,
    lon2: number | null,
    defaultText = "N/A"
): string => {
    if (lat1 === null || lon1 === null || lat2 === null || lon2 === null) {
        return defaultText;
    }

    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance < 1
        ? `${Math.round(distance * 1000)} m`
        : `${distance.toFixed(1)} km`;
};