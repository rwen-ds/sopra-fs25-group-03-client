"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import { User } from "@/types/user";
import SideBar from "@/components/SideBar";
import ErrorAlert from "@/components/ErrorAlert";
import { Avatar } from "@/components/Avatar";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import { Request } from "@/types/request";
import useLocalStorage from "@/hooks/useLocalStorage";
import Link from "next/link";
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

const Profile: React.FC = () => {
  const apiService = useApi();
  const router = useRouter();
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [postRequests, setPostRequests] = useState<Request[]>([]);
  const [volunteerRequests, setVolunteerRequests] = useState<Request[]>([]);
  const { value: currentUser } = useLocalStorage<User | null>("user", null);
  const { value: token } = useLocalStorage<string | null>('token', null);

  const { isLoading } = useAuthRedirect(token)

  useEffect(() => {
    if (isLoading || !currentUser?.id) return;
    const userId = currentUser.id;
    const fetchData = async () => {
      try {
        const [user, feedbacks, postRequests, volunteerRequests] = await Promise.all([
          apiService.get<User>(`/users/${userId}`),
          apiService.get<Feedback[]>(`/requests/${userId}/feedbacks`),
          apiService.get<Request[]>(`/requests/${userId}/post-requests`),
          apiService.get<Request[]>(`/requests/${userId}/volunteer-requests`)
        ]);

        setUserData(user);
        setFeedbacks(feedbacks);
        setPostRequests(postRequests.filter(req => req.status !== "DELETED"));
        setVolunteerRequests(volunteerRequests.filter(req => req.status !== "DELETED"));
      } catch (error) {
        if (error instanceof Error) {
          setErrorMessage(`Error fetching profile data: ${error.message}`);
        } else {
          console.error("Error fetching profile data:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiService, isLoading, currentUser?.id]);

  const handleEdit = () => {
    router.push("/profile/edit");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-dots loading-xs"></span>
      </div>
    );
  }

  const displayLanguage = userData?.language ? languageMap[userData.language] : null;


  return (
    <>
      <BackButton />

      <div className="flex flex-col h-screen bg-base-100">

        <div className="flex flex-1 overflow-hidden">
          <SideBar />
          <div className="flex-1 p-4 md:p-8 overflow-y-auto">
            <div className="max-w-6xl mx-auto mt-8">
              <ErrorAlert
                message={errorMessage}
                onClose={() => setErrorMessage(null)}
              />

              <div className="card bg-base-100 shadow-sm mb-8">
                <div className="card-body">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <Avatar name={userData?.username || "User"} />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h1 className="text-2xl font-bold">{userData?.username}</h1>
                        <button
                          onClick={handleEdit}
                          className="btn btn-sm btn-outline"
                        >
                          <PencilSquareIcon className="w-4 h-4 mr-1" />
                          Edit
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        <div>
                          <span className="font-semibold">Email:</span> {userData?.email}
                        </div>
                        <div>
                          <span className="font-semibold">Age:</span>{" "}
                          {userData?.age}
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
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Post Requests Card */}
                <div className="card bg-base-100 shadow-sm">
                  <div className="card-body">
                    <h2 className="card-title">
                      My Post Requests
                      <div className="badge badge-primary">{postRequests.length}</div>
                    </h2>
                    {postRequests.length > 0 ? (
                      <ul className="space-y-2">
                        {postRequests.slice().reverse().map((request) => (
                          <li key={request.id}>
                            <Link
                              href={`/requests/${request.id}`}
                              className="block p-3 bg-base-200 rounded-lg hover:bg-base-300 transition-colors"
                            >

                              <h3 className="font-medium truncate">{request.title}</h3>
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
                      <div className="text-center py-6 text-base-content/50">
                        <p className="text-sm">You haven&apos;t posted any requests yet</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Volunteer Requests Card */}
                <div className="card bg-base-100 shadow-sm">
                  <div className="card-body">
                    <h2 className="card-title">
                      My Volunteer Requests
                      <div className="badge badge-secondary">{volunteerRequests.length}</div>
                    </h2>
                    {volunteerRequests.length > 0 ? (
                      <ul className="space-y-2">
                        {volunteerRequests.slice().reverse().map((request) => (
                          <li key={request.id}>
                            <Link
                              href={`/requests/${request.id}`}
                              className="block p-3 bg-base-200 rounded-lg hover:bg-base-300 transition-colors"
                            >
                              <h3 className="font-medium truncate">{request.title}</h3>
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
                      <div className="text-center py-6 text-base-content/50">
                        <p className="text-sm">No volunteer requests yet</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Feedback Card */}
                <div className="card bg-base-100 shadow-sm">
                  <div className="card-body">
                    <h2 className="card-title">
                      Received Feedbacks
                      <div className="badge badge-accent">{feedbacks.length}</div>
                    </h2>
                    {feedbacks.length > 0 ? (
                      <ul className="space-y-3">
                        {feedbacks.slice().reverse().map((feedback, idx) => (
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
                                <p className="text-sm">{feedback.feedback}</p>
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-center py-6 text-base-content/50">
                        <p className="text-sm">No feedbacks received yet</p>
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

export default Profile;