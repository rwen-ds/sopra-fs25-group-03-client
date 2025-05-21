// components/LocationPermissionPrompt.tsx
"use client";

import { useState } from "react";

export const LocationPermissionPrompt = ({
    onAccept,
    onDeny
}: {
    onAccept: () => void;
    onDeny: () => void;
}) => {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-base-100 p-4 rounded-lg shadow-lg z-50 max-w-xs">
            <h3 className="font-bold mb-2">Enable Location Services</h3>
            <p className="text-sm mb-4">
                Allow access to your location to see locations of requests.
            </p>
            <div className="flex gap-2">
                <button
                    className="btn btn-sm btn-primary"
                    onClick={() => {
                        onAccept();
                        setIsVisible(false);
                    }}
                >
                    Allow
                </button>
                <button
                    className="btn btn-sm btn-ghost"
                    onClick={() => {
                        onDeny();
                        setIsVisible(false);
                    }}
                >
                    Deny
                </button>
            </div>
        </div>
    );
};