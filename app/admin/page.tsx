"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import { User } from "@/types/user";
import AdminSidebar from "@/components/AdminSideBar";

export default function AdminDashboard() {
  const router = useRouter();
  const apiService = useApi();
  const [admin, setAdmin] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminInfo = async () => {
      try {
        const user = await apiService.get<User>("/users/me");
        setAdmin(user);
      } catch (error) {
        console.error("Failed to fetch admin info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminInfo();
  }, [apiService]);

  const handleLogout = () => {
    apiService.put("/users/logout", {});
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 p-8 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center bg-base-100 p-4 rounded-lg shadow-md">
          <h1 className="text-3xl font-semibold">
            Welcome back, {admin?.username || "AdminName"}
          </h1>
          <button
            className="btn btn-primary ml-4"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

        {/* Dashboard Info */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : (
            <div>
              <p className="text-xl font-medium mb-4">
                Hello, {admin?.username || "AdminName"}!
              </p>
              <p className="text-gray-700">{admin?.email || "admin@example.com"}</p>
            </div>
          )}
        </div>

        {/* Stats / Cards (Optional Section) */}
        <div className="grid grid-cols-3 gap-6">
          <div className="card bg-white shadow-md p-6 rounded-lg">
            <h2 className="text-2xl font-semibold">Total Users</h2>
            <p className="text-3xl">200</p>
          </div>
          <div className="card bg-white shadow-md p-6 rounded-lg">
            <h2 className="text-2xl font-semibold">Pending Requests</h2>
            <p className="text-3xl">5</p>
          </div>
          <div className="card bg-white shadow-md p-6 rounded-lg">
            <h2 className="text-2xl font-semibold">Messages</h2>
            <p className="text-3xl">12</p>
          </div>
        </div>
      </div>
    </div>
  );
}
