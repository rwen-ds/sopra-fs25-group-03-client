"use client"

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import { User } from "@/types/user";
import SideBar from "@/components/SideBar";
import ErrorAlert from "@/components/ErrorAlert";
import { Avatar } from "@/components/Avatar";
import { ChatBubbleOvalLeftIcon } from "@heroicons/react/24/solid";
import { Request } from "@/types/request";
import Link from "next/link";
import useLocalStorage from "@/hooks/useLocalStorage";
import BackButton from "@/components/BackButton";
import useAuthRedirect from "@/hooks/useAuthRedirect";


const languageMap: { [key: string]: string } = {
    en: "English",
    de: "Deutsch",
    fr: "Français",
    it: "Italiano",
    zh: "中文",
    es: "Español",
    ja: "日本語",
    ko: "한국어"
};

interface Feedback {
    requestId: number;
    feedback: string;
    rating: number;
}

const UserProfile: React.FC = () => {
    const apiService = useApi();
    const { id } = useParams();
    const [userData, setUserData] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [postRequests, setPostRequests] = useState<Request[]>([]);
    const [volunteerRequests, setVolunteerRequests] = useState<Request[]>([]);
    const { value: currentUser } = useLocalStorage<User | null>("user", null);
    const isSelf = currentUser?.id === userData?.id;
    const { value: token } = useLocalStorage<string | null>('token', null);

    const { isLoading } = useAuthRedirect(token)

    useEffect(() => {
        if (isLoading || !id) return;

        // Fetch user profile
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

        // Fetch feedbacks for the user
        const fetchFeedbacks = async () => {
            try {
                const res = await apiService.get<Feedback[]>(`/requests/${id}/feedbacks`);
                setFeedbacks(res);
            } catch (error) {
                console.error("Failed to fetch feedbacks", error);
            }
        };

        // Fetch post requests made by the user
        const fetchPostRequests = async () => {
            try {
                const res = await apiService.get<Request[]>(`/requests/${id}/post-requests`);
                setPostRequests(res);
            } catch (error) {
                console.error("Failed to fetch post requests", error);
            }
        };

        // Fetch volunteer requests for the user
        const fetchVolunteerRequests = async () => {
            try {
                const res = await apiService.get<Request[]>(`/requests/${id}/volunteer-requests`);
                setVolunteerRequests(res);
            } catch (error) {
                console.error("Failed to fetch volunteer requests", error);
            }
        };

        fetchUserProfile();
        fetchFeedbacks();
        fetchPostRequests();
        fetchVolunteerRequests();
    }, [apiService, id, isLoading]);


    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    const displayLanguage = userData?.language ? languageMap[userData.language] : null;

    return (
        <>
            <BackButton />
            <div className="flex flex-col h-screen bg-gray-50">
                <div className="flex flex-1 overflow-hidden">
                    <SideBar />
                    <div className="flex-1 p-6 md:p-10 overflow-y-auto relative">
                        <div className="max-w-6xl mx-auto mt-12">
                            <ErrorAlert
                                message={errorMessage}
                                onClose={() => setErrorMessage(null)}
                                duration={5000}
                                type="error"
                            />

                            <div className="card bg-base-100 shadow-sm mb-8">
                                <div className="card-body flex flex-col md:flex-row items-center gap-6">
                                    <div className="flex-shrink-0">
                                        <Avatar name={userData?.username || "Unknown"} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h1 className="text-2xl font-bold">{userData?.username}</h1>
                                            {!isSelf && (
                                                <Link
                                                    href={`/chat/${userData?.id}`}
                                                    className="btn btn-sm btn-outline"
                                                >
                                                    <ChatBubbleOvalLeftIcon className="w-4 h-4 mr-1" />
                                                    Chat
                                                </Link>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                            <div>
                                                <span className="font-semibold">Email:</span> {userData?.email}
                                            </div>
                                            <div>
                                                <span className="font-semibold">Age:</span> {userData?.age ?? null}
                                            </div>
                                            <div>
                                                <span className="font-semibold">Language:</span> {displayLanguage ?? null}
                                            </div>
                                            <div>
                                                <span className="font-semibold">Gender:</span>{" "}
                                                {userData?.gender === "MALE"
                                                    ? "Male"
                                                    : userData?.gender === "FEMALE"
                                                        ? "Female"
                                                        : userData?.gender === "OTHER"
                                                            ? "Other"
                                                            : null}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Post Requests Card */}
                                <div className="card bg-base-100 shadow-md">
                                    <div className="card-body">
                                        <h2 className="card-title">
                                            Post Requests
                                            <div className="badge badge-primary">{postRequests.length}</div>
                                        </h2>
                                        {postRequests.length > 0 ? (
                                            <ul className="space-y-2">
                                                {postRequests.map((request, idx) => (
                                                    <li key={idx}>
                                                        <Link
                                                            href={`/requests/${request.id}`}
                                                            className="block p-3 bg-base-200 rounded-lg hover:bg-base-300 transition-colors"
                                                        >
                                                            <h3 className="font-medium text-base-content">{request.title}</h3>
                                                            <p className="text-sm text-base-content/80 mt-1 line-clamp-2">
                                                                {request.description}
                                                            </p>
                                                            {request.status && (
                                                                <div className="mt-2">
                                                                    <span className={`badge badge-xs ${request.status === 'DONE' ? 'badge-success' : 'badge-primary'
                                                                        }`}>
                                                                        {request.status}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <div className="text-center py-4 text-gray-500">
                                                No post requests yet
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Volunteer Requests Card */}
                                <div className="card bg-base-100 shadow-md">
                                    <div className="card-body">
                                        <h2 className="card-title">
                                            Volunteer Requests
                                            <div className="badge badge-secondary">{volunteerRequests.length}</div>
                                        </h2>
                                        {volunteerRequests.length > 0 ? (
                                            <ul className="space-y-2">
                                                {volunteerRequests.map((request, idx) => (
                                                    <li key={idx}>
                                                        <Link
                                                            href={`/requests/${request.id}`}
                                                            className="block p-3 bg-base-200 rounded-lg hover:bg-base-300 transition-colors"
                                                        >
                                                            <h3 className="font-medium text-base-content">{request.title}</h3>
                                                            <p className="text-sm text-base-content/80 mt-1 line-clamp-2">
                                                                {request.description}
                                                            </p>
                                                            {request.status && (
                                                                <div className="mt-2">
                                                                    <span className={`badge badge-xs ${request.status === 'DONE' ? 'badge-success' : 'badge-primary'
                                                                        }`}>
                                                                        {request.status}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <div className="text-center py-4 text-gray-500">
                                                No volunteer requests yet
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Feedback Card */}
                                <div className="card bg-base-100 shadow-md">
                                    <div className="card-body">
                                        <h2 className="card-title">
                                            Feedbacks
                                            <div className="badge badge-accent">{feedbacks.length}</div>
                                        </h2>
                                        {feedbacks.length > 0 ? (
                                            <ul className="space-y-3">
                                                {feedbacks.map((feedback, idx) => (
                                                    <li key={idx} className="p-3 bg-base-200 rounded-lg">
                                                        <Link
                                                            href={`/requests/${feedback.requestId}`}  // Use requestId to link to the specific request detail page
                                                            className="block p-3 hover:bg-base-300 rounded-lg"
                                                        >
                                                            <div className="flex items-start">
                                                                <div className="rating rating-xs mr-2">
                                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                                        <input
                                                                            key={star}
                                                                            type="radio"
                                                                            name={`rating-${idx}`}
                                                                            className={`mask mask-star ${feedback.rating >= star ? 'bg-yellow-400' : 'bg-gray-300'}`}
                                                                            checked={feedback.rating === star}
                                                                            readOnly
                                                                        />
                                                                    ))}
                                                                </div>
                                                                <p>{feedback.feedback}</p>
                                                            </div>
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <div className="text-center py-4 text-gray-500">
                                                No feedbacks yet
                                            </div>
                                        )}
                                    </div>
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
