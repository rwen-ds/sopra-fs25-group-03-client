"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import { User } from "@/types/user";
import Header from "@/components/LoggedIn";
import SideBar from "@/components/SideBar";
import ErrorAlert from "@/components/ErrorAlert";
import { Avatar } from "@/components/Avatar";

const UserProfile: React.FC = () => {
    const apiService = useApi();
    const { id } = useParams();
    const [userData, setUserData] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [feedbacks, setFeedbacks] = useState<string[]>([]);

    useEffect(() => {
        if (!id) return;
        const fetchUserProfile = async () => {
            try {
                const user = await apiService.get<User>(`/users/${id}`);
                setUserData(user);
            } catch (error) {
                if (error instanceof Error) {
                    setErrorMessage(`Error fetching user profile: ${error.message}`);
                } else {
                    console.error("Error fetching user profile:", error);
                }
            } finally {
                setLoading(false);
            }
        };

        const fetchFeedbacks = async () => {
            try {
                const res = await apiService.get<string[]>(`/requests/${id}/feedbacks`);
                setFeedbacks(res);
            } catch (error) {
                console.error("Failed to fetch feedbacks", error);
            }
        };

        fetchUserProfile();
        fetchFeedbacks();
    }, [apiService, id]);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <>
            <div className="flex flex-col h-screen">
                <Header />
                <div className="flex flex-1 overflow-hidden">
                    <SideBar />
                    <div className="flex-1 p-10 flex justify-center items-center relative">
                        <ErrorAlert
                            message={errorMessage}
                            onClose={() => setErrorMessage(null)}
                            duration={5000}
                            type="error"
                        />
                        <div className="card bg-base-200 shadow-sm w-full max-w-xl p-8 -mt-40">
                            <div className="flex flex-col items-center">
                                <Avatar name={userData?.username || "Unknown"} />

                                <h2 className="text-xl font-semibold text-base-content mt-4">
                                    {userData?.username}
                                </h2>
                            </div>

                            <div className="mt-6 space-y-2 text-base-content/70">
                                <div><span className="font-semibold">Email:</span> {userData?.email}</div>
                                <div><span className="font-semibold">Age:</span> {userData?.age ?? ""}</div>
                                <div><span className="font-semibold">Language:</span> {userData?.language}</div>
                                <div>
                                    <span className="font-semibold">Gender:</span>{" "}
                                    {userData?.gender === "MALE"
                                        ? "Male"
                                        : userData?.gender === "FEMALE"
                                            ? "Female"
                                            : userData?.gender === "OTHER"
                                                ? "Other"
                                                : ""}
                                </div>
                                <div>
                                    <h3 className="font-semibold">Feedbacks:</h3>
                                    {feedbacks.length > 0 ? (
                                        <ul className="list-disc pl-6 text-base-content/70 space-y-2">
                                            {feedbacks.map((feedback, idx) => (
                                                <li key={idx}>{feedback}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-base-content/60">No feedbacks yet.</p>
                                    )}
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </>
    );
};

export default UserProfile;
