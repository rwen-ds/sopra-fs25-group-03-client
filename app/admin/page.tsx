"use client";

import React, { useEffect, useState } from "react";
import { useApi } from "@/hooks/useApi";
import { User } from "@/types/user";
import AdminSidebar from "@/components/AdminSideBar";
import { useLogout } from "@/hooks/useLogout";

export default function AdminDashboard() {
  const apiService = useApi();
  const [admin, setAdmin] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const logout = useLogout();

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
      </div>
    </div>
  );
}
