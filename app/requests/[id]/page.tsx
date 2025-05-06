"use client";

import { useEffect, useState } from "react";
import { useApi } from "@/hooks/useApi";
import { Request } from "@/types/request";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import LoggedIn from "@/components/LoggedIn";
import useLocalStorage from "@/hooks/useLocalStorage";
import ErrorAlert from "@/components/ErrorAlert";

const RequestDetail: React.FC = () => {
  const { id } = useParams();
  const apiService = useApi();
  const [request, setRequest] = useState<Request | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { value: user } = useLocalStorage<{ id: number }>('user', { id: 0 });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  if (loading || !request) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col h-screen">
        <LoggedIn />
        <div className="relative flex justify-center items-center bg-base-100 p-4">
          <ErrorAlert
            message={errorMessage}
            onClose={() => setErrorMessage(null)}
            duration={5000}
            type="error"
          />
          <div className="card w-full max-w-5xl bg-base-200 shadow-xl rounded-xl p-6 md:p-10 grid md:grid-cols-2 gap-10">
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

              <div>
                <p className="font-semibold text-neutral">Description:</p>
                <p className="text-sm">{request.description}</p>
              </div>

              <div>
                <p className="font-semibold text-neutral">Contact Info:</p>
                <p className="text-sm">{request.contactInfo || <span>&nbsp;</span>}</p>
              </div>

              <div>
                <p className="font-semibold text-neutral">Location:</p>
                <p className="text-sm">{request.location || <span>&nbsp;</span>}</p>
              </div>

              <div>
                <p className="font-semibold text-neutral">Emergency Level:</p>
                <p className="badge badge-info badge-outline">{request.emergencyLevel || "N/A"}</p>
              </div>
              {request.feedback && request.feedback.trim() !== "" && (
                <div>
                  <p className="font-semibold text-neutral">Feedback:</p>
                  <p className="text-sm">
                    {request.feedback}
                  </p>
                </div>
              )}

              {/* buttons */}
              <div className="flex flex-wrap gap-4 mt-6 justify-center md:justify-start">
                {request.posterId !== user.id && request.status === "WAITING" && (
                  <button
                    className="btn btn-primary"
                    onClick={handleVolunteer}
                  >
                    Volunteer to Help
                  </button>
                )}
                <button
                  className="btn btn-outline"
                  onClick={() => router.push("/requests")}
                >
                  Back to Market
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RequestDetail;
