"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import { User } from "@/types/user";
import LoggedIn from "@/components/LoggedIn";
import SideBar from "@/components/SideBar";
import ErrorAlert from "@/components/ErrorAlert";
import { Avatar } from "@/components/Avatar";

const EditProfile: React.FC = () => {
    const [formData, setFormData] = useState<User | null>(null);
    const [userId, setUserId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const apiService = useApi();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);


    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await apiService.get<User>("/users/me");
                setFormData(data);
                setUserId(data.id);
            } catch (error) {
                console.error("Failed to load user:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [apiService]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (!formData) return;
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (!userId || !formData) return;
        try {
            await apiService.put(`/users/${userId}`, formData);
            router.push("/profile");
        } catch (error) {
            if (error instanceof Error) {
                setErrorMessage(`Failed to update user: ${error.message}`);
            } else {
                console.error("Failed to update user:", error);
            }
        }
    };

    if (loading || !formData) {
        return <div className="text-center mt-10">Loading...</div>;
    }

    return (
        <>
            <LoggedIn />
            <div className="flex h-[calc(100vh-80px)] overflow-hidden">
                <SideBar />
                <div className="relative flex-1 p-10 flex justify-center items-center">
                    <ErrorAlert
                        message={errorMessage}
                        onClose={() => setErrorMessage(null)}
                        duration={5000}
                        type="error"
                    />
                    <div className="card bg-base-200 rounded-2xl shadow-lg p-8 w-full max-w-xl overflow-y-auto">
                        <div className="flex justify-center">
                            <Avatar name={formData?.username || "Unknown"} />
                        </div>
                        <h2 className="text-xl font-bold text-center mt-4">Edit Profile</h2>

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
                            <input
                                type="number"
                                name="age"
                                className="input input-bordered w-full"
                                value={formData.age || ""}
                                onChange={handleChange}
                            />

                            <label className="label">
                                <span className="label-text">Language</span>
                            </label>
                            <input
                                type="text"
                                name="language"
                                className="input input-bordered w-full"
                                value={formData.language || ""}
                                onChange={handleChange}
                            />

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
                                <button className="btn btn-primary w-[48%]" onClick={handleSubmit}>
                                    Save
                                </button>
                                <button
                                    className="btn btn-neutral w-[48%]"
                                    onClick={() => router.push("/profile")}
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

export default EditProfile;