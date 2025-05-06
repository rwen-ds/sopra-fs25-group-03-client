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
                    password: "",
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

    return (
        <div className="min-h-screen flex from-indigo-100 to-purple-200">
            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content */}
            <div className="flex-1 p-8 space-y-8">
                {/* Top Bar */}
                <div className="flex justify-between items-center bg-base-100 p-4 rounded-lg shadow-md">
                    <div className="flex items-center">
                        <span className="text-3xl font-semibold">All Users</span>
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
                                    <td colSpan={columns.length} className="text-center">Loading...</td>
                                </tr>
                            ) : (
                                data.map((row) => (
                                    <tr key={row.id}>
                                        <td>{row.username}</td>
                                        <td>{row.email}</td>
                                        <td>{row.age}</td>
                                        <td>{row.language}</td>
                                        <td>{row.gender}</td>
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
