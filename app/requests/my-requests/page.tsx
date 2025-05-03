"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Request } from "@/types/request";
import { useApi } from "@/hooks/useApi";
import LoggedIn from "@/components/LoggedIn";
import Link from "next/link";
import SideBar from "@/components/SideBar";

const colors = [
  "bg-pink-200", "bg-yellow-200", "bg-green-200",
  "bg-blue-200", "bg-purple-200", "bg-red-200",
  "bg-orange-200", "bg-teal-200",
];

const MyRequest: React.FC = () => {
  const apiService = useApi();
  const [requests, setRequests] = useState<Request[]>([]);
  const router = useRouter();

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
      console.error("Failed to complete request:", error);
    }
  };

  return (
    <>
      <div className="flex flex-col h-screen">
        <LoggedIn />
        <div className="flex overflow-hidden">
          <SideBar />
          <div className="p-8 flex-1">
            <div className="text-left mb-8">
              <h2 className="text-3xl font-bold text-left mb-8">My Requests</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {requests.map((req, index) => (
                <div
                  key={req.id}
                  className={`rounded-2xl shadow-md p-4 transform hover:scale-105 transition duration-200 break-words ${colors[index % colors.length]}`}
                >
                  <Link href={`/requests/${req.id}`}>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                      {req.title}
                    </h3>
                    <p className="text-sm text-gray-700 mb-4">{req.description || "null"}</p>
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
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyRequest;
