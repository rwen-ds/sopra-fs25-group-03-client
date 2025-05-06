"use client";

import React, { useEffect, useState } from "react";
import { useApi } from "@/hooks/useApi";
import { Request } from "@/types/request";
import AdminSidebar from "@/components/AdminSideBar";
import { useLogout } from "@/hooks/useLogout";


const columns = [
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Description", dataIndex: "description", key: "description" },
    { title: "Contact Info", dataIndex: "contactInfo", key: "contactInfo" },
    { title: "Location", dataIndex: "location", key: "location" },
    { title: "Emergency Level", dataIndex: "emergencyLevel", key: "emergencyLevel" },
];

export default function AdminRequestsPage() {
    const apiService = useApi();
    const [data, setData] = useState<Request[]>([]);
    const [loading, setLoading] = useState(true);
    const logout = useLogout();

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const requests = await apiService.get<Request[]>("/requests");

                setData(
                    requests.map((r) => ({
                        id: r.id,
                        title: r.title,
                        description: r.description,
                        contactInfo: r.contactInfo,
                        location: r.location,
                        emergencyLevel: r.emergencyLevel,
                        volunteerId: null,
                        feedback: "",
                        status: "",
                        creationDate: "",
                        posterId: null
                    }))
                );
            } catch (err) {
                console.error("API error:", err);
                setData([]);
            } finally {
                setLoading(false);
            }
        };
        fetchRequests();
    }, [apiService]);

    const handleLogout = async () => {
        try {
            await apiService.put("/users/logout", {});
        } catch (error) {
            console.error("Logout API failed:", error);
        } finally {
            logout();
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content */}
            <div className="flex-1 p-8 space-y-8">
                {/* Top Bar */}
                <div className="flex justify-between items-center bg-base-100 p-4 rounded-lg shadow-md">
                    <div className="flex items-center">
                        <span className="text-3xl font-semibold">All Requests</span>
                    </div>
                    <div className="flex items-center">
                        <button
                            className="btn btn-primary"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {/* Table Content */}
                <div className="overflow-x-auto bg-white p-6 rounded-lg shadow-lg">
                    <table className="table w-full">
                        <thead>
                            <tr>
                                {columns.map((col) => (
                                    <th key={col.key} className="text-left p-4">{col.title}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={columns.length} className="text-center py-4">Loading...</td>
                                </tr>
                            ) : (
                                data.map((row) => (
                                    <tr key={row.id} className="hover:bg-gray-100">
                                        <td className="p-4">{row.title}</td>
                                        <td className="p-4">{row.description}</td>
                                        <td className="p-4">{row.contactInfo}</td>
                                        <td className="p-4">{row.location}</td>
                                        <td className="p-4">{row.emergencyLevel}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
