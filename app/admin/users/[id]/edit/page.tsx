"use client";

import { useEffect, useState } from "react";
import { useApi } from "@/hooks/useApi";
import { User } from "@/types/user";
import { useParams, useRouter } from "next/navigation";
import ErrorAlert from "@/components/ErrorAlert";
import useLocalStorage from "@/hooks/useLocalStorage";
import useAuthRedirect from "@/hooks/useAuthRedirect";
import AdminSideBar from "@/components/AdminSideBar";

const EditUser: React.FC = () => {
    const { id } = useParams();
    const router = useRouter();
    const apiService = useApi();
    const [formData, setFormData] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { value: token } = useLocalStorage<string | null>('token', null);
    const { isLoading } = useAuthRedirect(token);
    const { value: user } = useLocalStorage<User | null>('user', null);

    useEffect(() => {
        if (isLoading) return;
        const fetchUser = async () => {
            try {
                const data = await apiService.get<User>(`/users/${id}`);
                setFormData(data);
            } catch (error) {
                console.error("Failed to load user:", error);
            } finally {
                setLoading(false);
            }
        };
        if (id) {
            fetchUser();
        }
    }, [apiService, id, isLoading]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (!formData) return;
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value === "" ? null : value
        });
    };

    const handleSubmit = async () => {
        if (!formData) return;
        if (!formData.username?.trim() || !formData.email?.trim()) {
            setErrorMessage("Username and email cannot be empty.");
            return;
        }
        try {
            await apiService.put(`/users/${id}`, formData);
            router.push("/admin/users");
        } catch (error) {
            if (error instanceof Error) {
                setErrorMessage(`Failed to update user: ${error.message}`);
            } else {
                console.error("Failed to update user:", error);
            }
        }
    };

    if (loading || !formData) {
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
        <>
            <div className="flex h-screen overflow-hidden">
                <AdminSideBar />
                <div className="flex-1 p-8 overflow-y-auto relative">
                    <ErrorAlert
                        message={errorMessage}
                        onClose={() => setErrorMessage(null)}
                        duration={5000}
                        type="error"
                    />
                    <div className="card w-full max-w-xl bg-base-200 shadow-sm p-8 space-y-6 mx-auto mt-10">
                        <h2 className="text-xl font-bold text-center mt-4">Edit User</h2>

                        <div className="form-control w-full mt-6 space-y-4">
                            <label className="label">
                                <span className="label-text">Username</span>
                            </label>
                            <input
                                type="text"
                                name="username"
                                className="input input-bordered w-full"
                                value={formData.username || ""}
                                onChange={handleChange}
                            />

                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                className="input input-bordered w-full"
                                value={formData.email || ""}
                                onChange={handleChange}
                            />

                            <label className="label">
                                <span className="label-text">Age</span>
                            </label>
                            <select
                                name="age"
                                className="select select-bordered w-full"
                                value={formData.age || ""}
                                onChange={handleChange}
                            >
                                <option value="">Select age</option>
                                {Array.from({ length: 83 }, (_, i) => i + 18).map(age => (
                                    <option key={age} value={age}>
                                        {age}
                                    </option>
                                ))}
                            </select>

                            <label className="label">
                                <span className="label-text">Language</span>
                            </label>
                            <select
                                name="language"
                                className="select select-bordered w-full"
                                value={formData.language || ""}
                                onChange={handleChange}
                            >
                                <option value="">Select a language</option>
                                <option value="en">English</option>
                                <option value="de">German</option>
                                <option value="fr">French</option>
                                <option value="it">Italian</option>
                                <option value="zh">Chinese</option>
                                <option value="es">Spanish</option>
                                <option value="ja">Japanese</option>
                                <option value="ko">Korean</option>
                            </select>

                            <label className="label">
                                <span className="label-text">Gender</span>
                            </label>
                            <select
                                name="gender"
                                className="select select-bordered w-full"
                                value={formData.gender || ""}
                                onChange={handleChange}
                            >
                                <option value="">Select gender</option>
                                <option value="MALE">Male</option>
                                <option value="FEMALE">Female</option>
                                <option value="OTHER">Other</option>
                            </select>

                            <div className="flex justify-between mt-6">
                                <button className="btn btn-neutral w-[48%]" onClick={handleSubmit}>
                                    Save
                                </button>
                                <button
                                    className="btn btn-outline w-[48%]"
                                    onClick={() => router.push("/admin/users")}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EditUser;
