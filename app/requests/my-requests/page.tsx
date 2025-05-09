"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Request } from "@/types/request";
import { useApi } from "@/hooks/useApi";
import LoggedIn from "@/components/LoggedIn";
import Link from "next/link";
import SideBar from "@/components/SideBar";
import ErrorAlert from "@/components/ErrorAlert";

const colors = [
  "bg-primary/20", "bg-secondary/20", "bg-accent/20",
  "bg-info/20", "bg-success/20", "bg-warning/20",
  "bg-error/20"
];

const MyRequest: React.FC = () => {
  const apiService = useApi();
  const [requests, setRequests] = useState<Request[]>([]);
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      const res = await apiService.get<Request[]>("/requests/me");
      const reversedRequests = res.reverse();
      setRequests(reversedRequests);
    };
    fetchRequests();
  }, [apiService]);

  const handleDone = async (requestId: number | null) => {
    try {
      await apiService.put(`/requests/${requestId}/done`, {});
      router.push(`/requests/${requestId}/feedback`);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(`Failed to complete request: ${error.message}`);
      } else {
        console.error("Failed to complete request:", error);
      }
    }
  };

  return (
    <>
      <div className="flex flex-col h-screen">
        <LoggedIn />
        <div className="flex overflow-hidden">
          <SideBar />
          <div className="relative p-8 flex-1">
            <ErrorAlert
              message={errorMessage}
              onClose={() => setErrorMessage(null)}
              duration={5000}
              type="error"
            />
            <div className="text-left mb-8">
              <h2 className="text-xl font-bold text-left mb-8">My Requests</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6"
              style={{ gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))" }}>
              {requests.map((req) => {
                if (req.id == null) return null;
                const colorClass = colors[req.id % colors.length];
                return (
                  <div
                    key={req.id}
                    className={`w-full rounded-2xl shadow-md p-4 transform hover:scale-105 transition duration-200 break-words ${colorClass}`}
                  >
                    <Link href={`/requests/${req.id}`}>
                      <h3 className="text-lg font-bold mb-2">{req.title}</h3>
                      <p className="text-sm mb-4">{req.description || "null"}</p>
                    </Link>
                    <div className="flex justify-start gap-2 flex-wrap">
                      <button
                        onClick={() => router.push(`/requests/${req.id}/edit`)}
                        className="btn btn-outline btn-sm"
                      >
                        Edit
                      </button>
                      {req.status === "COMPLETED" && (
                        <button
                          onClick={() => handleDone(req.id)}
                          className="btn btn-primary btn-sm"
                        >
                          Done
                        </button>
                      )}
                      {req.status === "DONE" && !req.feedback && (
                        <button
                          onClick={() => router.push(`/requests/${req.id}/feedback`)}
                          className="btn btn-warning btn-outline btn-sm"
                        >
                          Give Feedback
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyRequest;
