// components/AdminSidebar.tsx
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/types/user";
import { useApi } from "@/hooks/useApi";

const AdminSidebar: React.FC = () => {
    const router = useRouter();
    const apiService = useApi();
    const [admin, setAdmin] = useState<User | null>(null);

    useEffect(() => {
        const fetchAdminInfo = async () => {
            try {
                const user = await apiService.get<User>("/users/me");
                setAdmin(user);
            } catch (error) {
                console.error("Failed to fetch admin info:", error);
            }
        };

        fetchAdminInfo();
    }, [apiService]);

    return (
        <div className="w-64 bg-base-200 flex flex-col p-4 space-y-6">
            {/* Avatar */}
            <div className="flex flex-col items-center">
                <div className="avatar placeholder mb-4">
                    <div className="bg-gradient-to-br from-blue-500 via-white-500 to-gray-500 rounded-full w-24 h-24">
                        {/* Add avatar here */}
                    </div>
                </div>
                <div className="font-semibold text-xl">{admin?.username || "admin"}</div>
            </div>

            {/* Navigation Menu */}
            <div className="space-y-2">
                <button
                    className="w-full py-3 px-4 text-left rounded-3xl hover:bg-base-300 focus:outline-none transition duration-200"
                    onClick={() => router.push("/admin")}
                >
                    Dashboard
                </button>
                <button
                    className="w-full py-3 px-4 text-left rounded-3xl hover:bg-base-300 focus:outline-none transition duration-200"
                    onClick={() => router.push("/admin/users")}
                >
                    Users
                </button>
                <button
                    className="w-full py-3 px-4 text-left rounded-3xl hover:bg-base-300 focus:outline-none transition duration-200"
                    onClick={() => router.push("/admin/requests")}
                >
                    Requests
                </button>
            </div>

            {/* Spacer */}
            <div className="flex-1"></div>
        </div>
    );
};

export default AdminSidebar;
