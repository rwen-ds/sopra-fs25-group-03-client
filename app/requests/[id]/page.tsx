"use client";

import { useEffect, useState } from "react";
import { useApi } from "@/hooks/useApi";
import { Request } from "@/types/request";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import useLocalStorage from "@/hooks/useLocalStorage";
import ErrorAlert from "@/components/ErrorAlert";
import Link from "next/link";
import BackButton from "@/components/BackButton";
import SideBar from "@/components/SideBar";
import { MapPinIcon } from "@heroicons/react/24/outline";
import useAuthRedirect from "@/hooks/useAuthRedirect";


const RequestDetail: React.FC = () => {
  const { id } = useParams();
  const apiService = useApi();
  const [request, setRequest] = useState<Request | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { value: user } = useLocalStorage<{ id: number }>('user', { id: 0 });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { value: token } = useLocalStorage<string | null>('token', null);

  const { isLoading } = useAuthRedirect(token)

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const data = await apiService.get<Request>(`/requests/${id}`);
        setRequest(data);
      } catch (error) {
        console.error("Error fetching request details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequest();
  }, [apiService, id]);

  const handleVolunteer = async () => {
    try {
      await apiService.put(`/requests/${id}/volunteer`, {});
      router.push("/requests");
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(`Failed to volunteer: ${error.message}`);
      } else {
        console.error("Failed to volunteer:", error);
      }
    }
  };

  const formatDate = (dateString: string | Date | null | undefined) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      timeZone: 'Europe/Zurich',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading || loading || !request) {
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
        <div className="flex-1 p-4 overflow-auto">
          <div className="relative flex justify-center items-center bg-base-100 p-4">
            <ErrorAlert
              message={errorMessage}
              onClose={() => setErrorMessage(null)}
              duration={5000}
              type="error"
            />
            <div className="card w-full max-w-5xl bg-base-200 shadow-sm rounded-xl p-6 md:p-10 grid md:grid-cols-2 gap-10">
              {/* left: image */}
              <div className="flex justify-center items-center">
                <Image
                  src="/cat.jpg"
                  alt="cat"
                  width={300}
                  height={300}
                  className="rounded-lg object-contain"
                />
              </div>

              {/* right: info */}
              <div className="flex flex-col gap-4">
                <h2 className="text-2xl font-bold">{request.title}</h2>

                {/* Add poster info with link */}
                <div>
                  <p className="font-semibold">Posted by:</p>
                  <Link
                    href={`/users/${request.posterId}`}
                    className="text-sm hover:text-blue-800 transition-colors duration-150"
                  >
                    {request.posterUsername || "Unknown"}
                  </Link>
                </div>


                <div>
                  <p className="font-semibold text-neutral">Description:</p>
                  <p className="text-sm">{request.description}</p>
                </div>

                {request.contactInfo && (
                  <div>
                    <p className="font-semibold text-neutral">Contact Info:</p>
                    <p className="text-sm">{request.contactInfo}</p>
                  </div>
                )}

                {request.location && (request.latitude && request.longitude) && (
                  <div>
                    <p className="font-semibold text-neutral">Location:</p>
                    <div className="text-sm flex items-center gap-2">
                      <span>{request.location}</span>
                      <a
                        href={`https://www.google.com/maps?q=${request.latitude},${request.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Open in Google Maps"
                      >
                        <MapPinIcon className="h-5 w-5 text-blue-500 hover:text-blue-700 cursor-pointer" />
                      </a>
                    </div>
                  </div>
                )}


                {/* Add timestamps */}
                <div>
                  <p className="font-semibold text-neutral">Created:</p>
                  <p className="text-sm">{formatDate(request.publishedAt)}</p>
                </div>

                {/* Add status */}
                <div>
                  <p className="font-semibold text-neutral">Status:</p>
                  <span className={`badge badge-outline badge-sm ${request.status === 'DONE' ? 'badge-success' :
                    'badge-primary'}`}>
                    {request.status}
                  </span>
                </div>

                {/* Add volunteer info if exists */}
                {request.volunteerId && (
                  <div>
                    <p className="font-semibold text-neutral">Volunteered by:</p>
                    <Link
                      href={`/users/${request.volunteerId}`}
                      className="text-sm hover:text-blue-800 transition-colors duration-150"
                    >
                      {request.volunteerUsername || null}
                    </Link>
                  </div>
                )}

                <div>
                  <p className="font-semibold text-neutral">Emergency Level:</p>
                  <span
                    className={`badge badge-outline badge-sm px-4 py-2 ${request.emergencyLevel === 'HIGH'
                      ? 'badge-error'
                      : request.emergencyLevel === 'MEDIUM'
                        ? 'badge-warning'
                        : 'badge-success'
                      }`}
                  >
                    {request.emergencyLevel || "N/A"}
                  </span>
                </div>
                {request.rating != 0 && (
                  <div>
                    <p className="font-semibold text-neutral">Feedback Rate:</p>
                    <div className="rating rating-xs">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <input
                          key={star}
                          type="radio"
                          name={`rating-${request.id}`}
                          className={`mask mask-star ${request.rating! >= star ? 'bg-yellow-400' : 'bg-gray-300'}`}
                          checked={request.rating === star}
                          readOnly
                        />
                      ))}
                    </div>
                  </div>
                )}
                {request.feedback && request.feedback.trim() !== "" && (
                  <div>
                    <p className="font-semibold text-neutral">Feedback Comment:</p>
                    <p className="text-sm">
                      {request.feedback}
                    </p>
                  </div>
                )}

                {/* buttons */}
                <div className="flex flex-wrap gap-4 mt-6 justify-center md:justify-start">
                  {request.posterId !== user.id && request.status === "WAITING" && (
                    <button
                      className="btn btn-neutral"
                      onClick={handleVolunteer}
                    >
                      Volunteer to Help
                    </button>
                  )}
                  <button
                    className="btn btn-outline"
                    onClick={() => router.push(request.posterId === user.id ? "/requests/my-requests" : "/requests")}
                  >
                    {request.posterId === user.id ? "Go to My Requests" : "Go to Market"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RequestDetail;
