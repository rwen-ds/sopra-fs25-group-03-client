"use client";

import React, { useEffect, useState } from "react";
import { useApi } from "@/hooks/useApi";
import { User } from "@/types/user";
import { Request } from "@/types/request";
import AdminSidebar from "@/components/AdminSideBar";
import { useLogout } from "@/hooks/useLogout";
import useAuthRedirect from "@/hooks/useAuthRedirect";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useRouter } from "next/navigation";


export default function AdminDashboard() {
  const apiService = useApi();
  const router = useRouter();
  const logout = useLogout();

  const [admin, setAdmin] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [totalUsers, setTotalUsers] = useState(0);
  const [totalRequests, setTotalRequests] = useState(0);
  const [highCount, setHighCount] = useState(0);
  const [mediumCount, setMediumCount] = useState(0);
  const [lowCount, setLowCount] = useState(0);
  const { value: token } = useLocalStorage<string | null>('token', null);
  const { isLoading } = useAuthRedirect(token)
  const { value: user } = useLocalStorage<User | null>('user', null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [user, users, requests] = await Promise.all([
          apiService.get<User>("/users/me"),
          apiService.get<User[]>("/users"),
          apiService.get<Request[]>("/requests")
        ]);

        setAdmin(user);
        setTotalUsers(users.length);

        const validRequests = requests.filter((r) => r.status?.toLowerCase() !== "deleted");
        setTotalRequests(validRequests.length);

        const high = validRequests.filter((r) => r.emergencyLevel?.toLowerCase() === "high").length;
        const medium = validRequests.filter((r) => r.emergencyLevel?.toLowerCase() === "medium").length;
        const low = validRequests.filter((r) => r.emergencyLevel?.toLowerCase() === "low").length;

        setHighCount(high);
        setMediumCount(medium);
        setLowCount(low);
      } catch (err) {
        console.error("Failed to load admin dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
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

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-dots loading-xs"></span>
      </div>
    );
  }

  if (!user?.isAdmin) {
    router.push("/login")
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 pt-16 pb-20 px-6 sm:px-10 space-y-10">
        {/* Header */}
        <div className="flex justify-between items-center bg-base-100 p-4 rounded-lg shadow-md">
          <h1 className="text-3xl font-semibold">
            Welcome back, {admin?.username || "AdminName"}
          </h1>
          <button className="btn btn-neutral ml-4" onClick={handleLogout}>
            Logout
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Users */}
          <div className="bg-white shadow-md p-6 rounded-xl">
            <h2 className="text-lg font-medium mb-2">Total Users</h2>
            <p className="text-4xl font-semibold">{totalUsers - 1}</p>
          </div>

          {/* Total Requests */}
          <div className="bg-white shadow-md p-6 rounded-xl">
            <h2 className="text-lg font-medium mb-2">Total Requests</h2>
            <p className="text-4xl font-semibold">{totalRequests}</p>
          </div>

          {/* Pie Chart */}
          <div className="bg-white shadow-md p-6 rounded-xl">
            <div className="mb-4">
              <h2 className="text-lg font-medium">Emergency Distribution</h2>
            </div>
            <div className="flex items-center gap-4">
              <svg width="100" height="100" viewBox="0 0 36 36" className="transform -rotate-90">
                <circle cx="18" cy="18" r="16" fill="none" stroke="#e5e7eb" strokeWidth="3.5" />
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  stroke="#fca5a5"
                  strokeWidth="3.5"
                  strokeDasharray={`${(highCount / totalRequests) * 100} ${100 - (highCount / totalRequests) * 100}`}
                  strokeDashoffset="0"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  stroke="#fde68a"
                  strokeWidth="3.5"
                  strokeDasharray={`${(mediumCount / totalRequests) * 100} ${100 - (mediumCount / totalRequests) * 100}`}
                  strokeDashoffset={`${(highCount / totalRequests) * 100}`}
                />
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  stroke="#bbf7d0"
                  strokeWidth="3.5"
                  strokeDasharray={`${(lowCount / totalRequests) * 100} ${100 - (lowCount / totalRequests) * 100}`}
                  strokeDashoffset={`${(highCount + mediumCount) / totalRequests * 100}`}
                />
              </svg>
              <div className="text-sm space-y-1">
                <p><span className="inline-block w-3 h-3 rounded-full bg-red-300 mr-2"></span>High: {highCount}</p>
                <p><span className="inline-block w-3 h-3 rounded-full bg-yellow-300 mr-2"></span>Medium: {mediumCount}</p>
                <p><span className="inline-block w-3 h-3 rounded-full bg-green-300 mr-2"></span>Low: {lowCount}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
