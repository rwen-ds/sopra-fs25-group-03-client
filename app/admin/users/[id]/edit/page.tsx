"use client";

import { useEffect, useState } from "react";
import { useApi } from "@/hooks/useApi";
import { User } from "@/types/user";
import { useParams, useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSideBar";
import ErrorAlert from "@/components/ErrorAlert";

const EditUser: React.FC = () => {
    const { id } = useParams();
    const router = useRouter();
    const apiService = useApi();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await apiService.get<User>(`/users/${id}`);
                setUser(data);
            } catch (error) {
                if (error instanceof Error) {
                    setErrorMessage(`Error fetching user data: ${error.message}`);
                } else {
                    console.error("Error fetching user data:", error);
                }
            } finally {
                setLoading(false);
            }
        };
        if (id) {
            fetchUser();
        }
    }, [apiService, id]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!user) return;

        try {
            await apiService.put<User>(`/users/${id}`, user);
            router.push("/admin/users");
        } catch (error) {
            if (error instanceof Error) {
                setErrorMessage(`Error updating user: ${error.message}`);
            } else {
                console.error("Error updating user:", error);
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (!user) return;
        const { name, value } = e.target;
        setUser(prev => prev ? { ...prev, [name]: value } : null);
    };

    if (loading || !user) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex">
            <AdminSidebar />
            <div className="flex-1 p-8">
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-2xl font-bold mb-6">Edit User</h1>
                    
                    <ErrorAlert
                        message={errorMessage}
                        onClose={() => setErrorMessage(null)}
                        duration={5000}
                        type="error"
                    />

                    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-lg">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Username</span>
                            </label>
                            <input
                                type="text"
                                name="username"
                                value={user.username || ""}
                                onChange={handleChange}
                                className="input input-bordered w-full"
                                required
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Email</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={user.email || ""}
                                onChange={handleChange}
                                className="input input-bordered w-full"
                                required
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Age</span>
                            </label>
                            <input
                                type="number"
                                name="age"
                                value={user.age || ""}
                                onChange={handleChange}
                                className="input input-bordered w-full"
                                min="0"
                                max="120"
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Language</span>
                            </label>
                            <input
                                type="text"
                                name="language"
                                value={user.language || ""}
                                onChange={handleChange}
                                className="input input-bordered w-full"
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Gender</span>
                            </label>
                            <select
                                name="gender"
                                value={user.gender || ""}
                                onChange={handleChange}
                                className="select select-bordered w-full"
                            >
                                <option value="">Select Gender</option>
                                <option value="MALE">Male</option>
                                <option value="FEMALE">Female</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </div>

                        <div className="flex justify-end gap-4 mt-6">
                            <button
                                type="button"
                                className="btn btn-outline"
                                onClick={() => router.push("/admin/users")}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditUser; 