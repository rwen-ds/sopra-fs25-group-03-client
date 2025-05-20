"use client";

import { GoogleMap, InfoWindow, Marker, useLoadScript } from "@react-google-maps/api";
import { Request } from "@/types/request";
import { useEffect, useState } from "react";
import Link from "next/link";

const mapContainerStyle = {
    width: "100%",
    height: "600px",
};

const center = {
    lat: 47.3769, // Zurich
    lng: 8.5417,
};



// Offset function: to avoid overlapping coordinates
const getOffsetPosition = (lat: number, lng: number, index: number) => {
    const baseOffset = 0.00015; // Base offset, roughly 15 meters
    const ring = Math.floor(index / 5); // Every 5 markers form a circular ring
    const angle = (index * 72) % 360;
    const radius = baseOffset * (ring + 1); // Increase radius for each new ring
    const rad = angle * (Math.PI / 180);
    return {
        lat: lat + radius * Math.cos(rad),
        lng: lng + radius * Math.sin(rad),
    };
};

export const RequestsMap = ({
    requests,
    userLat,
    userLon
}: {
    requests: Request[];
    userLat: number | null;
    userLon: number | null;
}) => {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    });

    const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
    const [mapCenter, setMapCenter] = useState(center); // State to store the map center

    useEffect(() => {
        if (userLat && userLon) {
            setMapCenter({ lat: userLat, lng: userLon }); // Update the center based on user position
        }
    }, [userLat, userLon]);

    if (!isLoaded) return <div>Loading map...</div>;

    // Group requests by their coordinates
    const coordMap = new Map<string, Request[]>();
    requests.forEach((req) => {
        if (req.latitude && req.longitude) {
            const key = `${req.latitude.toFixed(5)}-${req.longitude.toFixed(5)}`;
            if (!coordMap.has(key)) {
                coordMap.set(key, []);
            }
            coordMap.get(key)?.push(req);
        }
    });

    return (
        <div className="rounded-xl overflow-hidden border">
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                zoom={10}
                center={mapCenter}
            >
                {/* User location marker */}
                {userLat && userLon && (
                    <Marker
                        position={{ lat: userLat, lng: userLon }}
                        icon={{
                            path: google.maps.SymbolPath.CIRCLE,
                            scale: 8,
                            fillColor: "#4285F4",
                            fillOpacity: 1,
                            strokeWeight: 2,
                            strokeColor: "#FFFFFF",
                        }}
                    />
                )}

                {/* Request markers with offset to avoid overlap */}
                {Array.from(coordMap.entries()).flatMap(([, groupedRequests]) =>
                    groupedRequests.map((request, index) => {
                        if (!request.latitude || !request.longitude) return null;

                        const { lat, lng } = getOffsetPosition(request.latitude, request.longitude, index);

                        let markerColor = "#00FF00";
                        switch (request.emergencyLevel?.toLowerCase()) {
                            case "high":
                                markerColor = "#FF0000";
                                break;
                            case "medium":
                                markerColor = "#FFA500";
                                break;
                            case "low":
                                markerColor = "#00FF00";
                                break;
                        }

                        return (
                            <Marker
                                key={request.id}
                                position={{ lat, lng }}
                                icon={{
                                    path: google.maps.SymbolPath.CIRCLE,
                                    scale: 12,
                                    fillColor: markerColor,
                                    fillOpacity: 1,
                                    strokeWeight: 3,
                                    strokeColor: "#FFFFFF",
                                }}
                                onClick={() => {
                                    setSelectedRequest(request)
                                    setMapCenter({ lat, lng })
                                }}
                                title={request.title || "Untitled Request"}
                            />
                        );
                    })
                )}

                {/* info */}
                {selectedRequest && (
                    <InfoWindow
                        position={{
                            lat: mapCenter.lat || 0,
                            lng: mapCenter.lng || 0
                        }}
                        onCloseClick={() => setSelectedRequest(null)}
                    >
                        <div className="card w-64 bg-base-100 shadow-xl">
                            <div className="card-body p-4">
                                <h2 className="card-title text-lg line-clamp-1 mb-3">{selectedRequest.title}</h2>
                                <p className="text-sm line-clamp-3 mb-3">
                                    {selectedRequest.description || "No description provided"}
                                </p>
                                <div className="card-actions justify-end">
                                    <Link
                                        href={`/requests/${selectedRequest.id}`}
                                        className="btn btn-neutral btn-sm"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </InfoWindow>
                )}
            </GoogleMap>
        </div>
    );
};
