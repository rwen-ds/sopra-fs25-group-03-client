"use client"

import React, { useEffect } from "react";

interface ErrorAlertProps {
    message: string | null;
    onClose: () => void;
    duration?: number;
    type?: "error" | "success" | "info";
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({
    message,
    onClose,
    duration = 5000,
    type = "error",
}) => {
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [message, duration, onClose]);

    if (!message) return null;

    const typeClass =
        type === "error"
            ? "alert-error"
            : type === "success"
                ? "alert-success"
                : "alert-info";

    return (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-2xl">
            <div className={`alert ${typeClass} alert-soft flex justify-between items-center`}>
                <span className="flex-1">{message}</span>
                <button
                    className="ml-4 hover:text-black"
                    onClick={onClose}
                >
                    ✕
                </button>
            </div>
        </div>
    );
};

export default ErrorAlert;
