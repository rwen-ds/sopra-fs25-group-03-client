"use client";

import React, { useEffect, useState } from "react";
import { useApi } from "@/hooks/useApi";
import { User } from "@/types/user";
import AdminSidebar from "@/components/AdminSideBar";
import { useLogout } from "@/hooks/useLogout";

const columns = [
    { title: "Username", dataIndex: "username", key: "username" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Age", dataIndex: "age", key: "age" },
    { title: "Language", dataIndex: "language", key: "language" },
    { title: "Gender", dataIndex: "gender", key: "gender" },
];

export default function AdminUsersPage() {
    const apiService = useApi();
    const [data, setData] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filterLanguage, setFilterLanguage] = useState("All");
    const [filterGender, setFilterGender] = useState("All");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userIdToDelete, setUserIdToDelete] = useState<number | null>(null);
    const logout = useLogout();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const users = await apiService.get<User[]>("/users");
                const filteredUsers = users.filter((user) => user.username !== "admin");
                const mappedData = filteredUsers.map((user) => ({
                    id: user.id,
                    username: user.username || "-",
                    email: user.email || "-",
                    age: user.age || null,
                    language: user.language || "-",
                    gender: user.gender === "MALE" ? "Male" :
                        user.gender === "FEMALE" ? "Female" :
                            user.gender === "OTHER" ? "Other" : "-",
                    creationDate: "",
                    birthday: "",
                    school: "",
                    isAdmin: false,
                    status: ""
                }));
                setData(mappedData);
            } catch (err) {
                console.error("API error:", err);
                setData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
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
        if (userIdToDelete === null) return;

        try {
            await apiService.delete(`/users/${userIdToDelete}`);
            setData((prev) => prev.filter((user) => user.id !== userIdToDelete));
        } catch (err) {
            console.error("Failed to delete user:", err);
            alert("Failed to delete user.");
        } finally {
            setIsModalOpen(false);
        }
    };

    const filteredData = data.filter(user => {
        const matchesSearch = user.username?.toLowerCase().includes(search.toLowerCase()) ||
            user.email?.toLowerCase().includes(search.toLowerCase());
        const matchesLanguage = filterLanguage === "All" || user.language === filterLanguage;
        const matchesGender = filterGender === "All" || user.gender === filterGender;
        return matchesSearch && matchesLanguage && matchesGender;
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
                            placeholder="Search for a user by name or keyword"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                        {/* Language Filter */}
                        <select
                            className="select select-bordered w-30 select-sm"
                            value={filterLanguage}
                            onChange={(e) => setFilterLanguage(e.target.value)}
                        >
                            <option value="All">All Languages</option>
                            {[...new Set(data.map(d => d.language))].map((lang) => (
                                <option key={lang} value={lang || 'Unknown'}>
                                    {lang || 'Unknown'}
                                </option>
                            ))}
                        </select>

                        {/* Gender Filter */}
                        <select
                            className="select select-bordered w-30 select-sm"
                            value={filterGender}
                            onChange={(e) => setFilterGender(e.target.value)}
                        >
                            <option value="All">All Genders</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>

                        {/* Clear Filters Button */}
                        <button
                            className="btn btn-outline btn-sm"
                            onClick={() => {
                                setSearch('');
                                setFilterGender('All');
                                setFilterLanguage('All');
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
                                    <th key={col.key}>{col.title}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={columns.length + 1} className="text-center">Loading...</td>
                                </tr>
                            ) : (
                                filteredData.map((row) => (
                                    <tr key={row.id}>
                                        <td>{row.username}</td>
                                        <td>{row.email}</td>
                                        <td>{row.age}</td>
                                        <td>{row.language}</td>
                                        <td>{row.gender}</td>
                                        <td>
                                            <button
                                                className="btn btn-error btn-sm"
                                                onClick={() => {
                                                    setUserIdToDelete(row.id);
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
                        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
                            Confirm User Deletion
                        </h2>
                        <p className="text-gray-600 text-center mb-6">
                            Are you sure you want to delete this user? This action cannot be undone.
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
