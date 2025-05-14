// components/RequestsMap.tsx
"use client";

import { GoogleMap, InfoWindow, Marker, useLoadScript } from "@react-google-maps/api";
import { Request } from "@/types/request";
import { useState } from "react";
import Link from "next/link";

const mapContainerStyle = {
    width: "100%",
    height: "600px",
};

const center = {
    lat: 47.3769, // Zurich
    lng: 8.5417,
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

    if (!isLoaded) return <div>Loading map...</div>;

    return (
        <div className="rounded-xl overflow-hidden border">
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                zoom={10}
                center={userLat && userLon ? { lat: userLat, lng: userLon } : center}
            >
                {/* location mark */}
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

                {/* request mark */}
                {requests.map((request) => {
                    if (!request.latitude || !request.longitude) return null;

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
                            position={{ lat: request.latitude, lng: request.longitude }}
                            icon={{
                                path: google.maps.SymbolPath.CIRCLE,
                                scale: 12,
                                fillColor: markerColor,
                                fillOpacity: 1,
                                strokeWeight: 3,
                                strokeColor: "#FFFFFF",
                            }}
                            onClick={() => setSelectedRequest(request)}
                            title={request.title || "Untitled Request"}
                        />
                    );
                })}
                {selectedRequest && (
                    <InfoWindow
                        position={{
                            lat: selectedRequest.latitude || 0,
                            lng: selectedRequest.longitude || 0
                        }}
                        onCloseClick={() => setSelectedRequest(null)}
                    >
                        <div className="card w-64 bg-base-100 shadow-xl">
                            <div className="card-body p-4">
                                <h2 className="card-title text-lg">{selectedRequest.title}</h2>
                                <p className="text-sm line-clamp-3 mb-3">
                                    {selectedRequest.description || "No description provided"}
                                </p>
                                <div className="card-actions justify-end">
                                    <Link
                                        href={`/requests/${selectedRequest.id}`}
                                        className="btn btn-primary btn-sm"
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