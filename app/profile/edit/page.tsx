"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import { User } from "@/types/user";
import SideBar from "@/components/SideBar";
import ErrorAlert from "@/components/ErrorAlert";
import { Avatar } from "@/components/Avatar";
import BackButton from "@/components/BackButton";
import useLocalStorage from "@/hooks/useLocalStorage";
import useAuthRedirect from "@/hooks/useAuthRedirect";

const EditProfile: React.FC = () => {
    const [formData, setFormData] = useState<User | null>(null);
    const [userId, setUserId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const apiService = useApi();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { value: token } = useLocalStorage<string | null>('token', null);

    const { isLoading } = useAuthRedirect(token);

    useEffect(() => {
        if (isLoading) return;
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
    }, [apiService, isLoading]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (!formData) return;
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value === "" ? null : value
        });
    };


    const handleSubmit = async () => {
        if (!userId || !formData) return;

        if (!formData.username?.trim() || !formData.email?.trim()) {
            setErrorMessage("Username and email cannot be empty.");
            return;
        }
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
        return (
            <div className="min-h-screen flex items-center justify-center">
                <span className="loading loading-dots loading-xs"></span>
            </div>
        );
    }

    return (
        <>
            <BackButton />
            <div className="flex h-screen">
                <SideBar />
                <div className="flex-1 p-8 overflow-y-auto relative">
                    <ErrorAlert
                        message={errorMessage}
                        onClose={() => setErrorMessage(null)}
                        duration={5000}
                        type="error"
                    />
                    <div className="card w-full max-w-xl bg-base-200 shadow-sm p-8 space-y-6 mx-auto mt-10">
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
                                required
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
                                required
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
                                <option value="de">Deutsch</option>
                                <option value="fr">Français</option>
                                <option value="it">Italiano</option>
                                <option value="zh">中文</option>
                                <option value="es">Español</option>
                                <option value="ja">日本語</option>
                                <option value="ko">한국어</option>
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