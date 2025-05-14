"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Request } from "@/types/request";
import { useApi } from "@/hooks/useApi";
import Link from "next/link";
import SideBar from "@/components/SideBar";
import ErrorAlert from "@/components/ErrorAlert";


const MyRequest: React.FC = () => {
  const apiService = useApi();
  const [requests, setRequests] = useState<Request[]>([]);
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [filterEmergencyLevel, setFilterEmergencyLevel] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      const res = await apiService.get<Request[]>("/requests/me");
      const filteredRequests = res
        .filter(req => req.status !== "DELETED")
        .reverse();
      setRequests(filteredRequests);
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

  // Apply search and filter logic
  const filteredRequests = requests.filter((req) => {
    // Search filter
    const matchesSearch =
      req.title?.toLowerCase().includes(search.toLowerCase()) ||
      req.description?.toLowerCase().includes(search.toLowerCase());

    // Emergency level filter
    const matchesEmergency =
      filterEmergencyLevel === "All" ||
      req.emergencyLevel?.toLowerCase() === filterEmergencyLevel.toLowerCase();

    return matchesSearch && matchesEmergency;
  });

  return (
    <>
      <div className="flex flex-col h-screen">
        <div className="flex overflow-hidden">
          <SideBar />
          <div className="relative p-8 flex-1">
            <ErrorAlert
              message={errorMessage}
              onClose={() => setErrorMessage(null)}
              duration={5000}
              type="error"
            />
            <div className="text-left mb-8 mt-10">
              <h2 className="text-xl font-bold text-left mb-8">My Requests</h2>
            </div>

            {/* Search & Filter */}
            <div className="grid sm:grid-cols-2 md:flex md:flex-wrap gap-4 items-center mb-6">
              <input
                type="text"
                className="input w-full sm:w-64"
                placeholder="Search title or description"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select
                className="select w-full sm:w-48"
                value={filterEmergencyLevel}
                onChange={(e) => setFilterEmergencyLevel(e.target.value)}
              >
                <option value="All">All Emergency Levels</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              <button
                className="btn btn-outline btn-sm w-full sm:w-auto"
                onClick={() => {
                  setSearch('');
                  setFilterEmergencyLevel('All');
                }}
              >
                Clear Filters
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {filteredRequests.map((req) => {
                if (req.id == null) return null;
                return (
                  <div
                    key={req.id}
                    className="w-full rounded-2xl shadow-md p-4 transform hover:scale-105 transition duration-200 break-words border"
                  >
                    <Link href={`/requests/${req.id}`}>
                      <h3 className="text-lg font-bold mb-2">{req.title}</h3>
                      <p className="text-sm mb-4">{req.description || "null"}</p>
                    </Link>
                    <div className="flex justify-start gap-2 flex-wrap">
                      {req.status !== "DONE" && (
                        <button
                          onClick={() => router.push(`/requests/${req.id}/edit`)}
                          className="btn btn-outline btn-sm"
                        >
                          Edit
                        </button>
                      )}
                      {req.status === "COMPLETED" && (
                        <button
                          onClick={() => handleDone(req.id)}
                          className="btn btn-primary btn-sm"
                        >
                          Done
                        </button>
                      )}
                      {req.status === "DONE" && (
                        <button
                          onClick={() => router.push(`/requests/${req.id}/feedback`)}
                          className="btn btn-warning btn-outline btn-sm"
                        >
                          Feedback
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
