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
    const [search, setSearch] = useState("");
    const [filterEmergencyLevel, setFilterEmergencyLevel] = useState("All");
    const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null); // 当前选中的请求 ID
    const [isModalOpen, setIsModalOpen] = useState(false); // 控制 modal 显示
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

    const handleDelete = async () => {
        if (selectedRequestId === null) return;

        try {
            await apiService.delete(`/requests/${selectedRequestId}`);
            setData((prev) => prev.filter((req) => req.id !== selectedRequestId));
            setIsModalOpen(false);
        } catch (err) {
            console.error("Failed to delete request:", err);
            alert("Failed to delete request.");
        }
    };

    const filteredData = data.filter(request => {
        const matchesSearch = request.title?.toLowerCase().includes(search.toLowerCase()) ||
            request.description?.toLowerCase().includes(search.toLowerCase());
        const matchesEmergencyLevel = filterEmergencyLevel === "All" || request.emergencyLevel === filterEmergencyLevel;
        return matchesSearch && matchesEmergencyLevel;
    });

    return (
        <div className="min-h-screen flex from-indigo-100 to-purple-200">
            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content */}
            <div className="flex-1 p-8 space-y-8">
                {/* Top Bar */}
                <div className="flex justify-between items-center bg-base-100 p-4 rounded-lg shadow-md">
                    {/* Search + Filters */}
                    <div className="flex gap-4 items-center">
                        {/* Search Box */}
                        <input
                            type="text"
                            className="input input-bordered w-96"
                            placeholder="Search for a request by title or description"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                        {/* Emergency Level Filter */}
                        <select
                            className="select select-bordered w-30 select-sm"
                            value={filterEmergencyLevel}
                            onChange={(e) => setFilterEmergencyLevel(e.target.value)}
                        >
                            <option value="All">All Emergency Levels</option>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>

                        {/* Clear Filters Button */}
                        <button
                            className="btn btn-outline btn-sm"
                            onClick={() => {
                                setSearch('');
                                setFilterEmergencyLevel('All');
                            }}
                        >
                            Clear Filters
                        </button>
                    </div>

                    {/* Logout Button */}
                    <div className="flex items-center">
                        <button
                            className="btn btn-primary"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {/* Table */}
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
                                filteredData.map((row) => (
                                    <tr key={row.id} className="hover:bg-gray-100">
                                        <td className="p-4">{row.title}</td>
                                        <td className="p-4">{row.description}</td>
                                        <td className="p-4">{row.contactInfo}</td>
                                        <td className="p-4">{row.location}</td>
                                        <td className="p-4">{row.emergencyLevel}</td>
                                        <td className="p-4">
                                            <button
                                                className="btn btn-error btn-sm"
                                                onClick={() => {
                                                    setSelectedRequestId(row.id);
                                                    setIsModalOpen(true);
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="modal modal-open">
                    <div className="modal-box rounded-2xl shadow-xl">
                        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Confirm Deletion</h2>
                        <p className="text-gray-600 text-center mb-6">
                            Are you sure you want to delete this request? This action cannot be undone.
                        </p>

                        <div className="modal-action justify-center">
                            <button
                                className="btn btn-outline"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-error"
                                onClick={handleDelete}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
