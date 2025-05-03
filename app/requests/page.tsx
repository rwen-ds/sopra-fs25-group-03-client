"use client";

import { useEffect, useState } from "react";
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

const RequestMarket: React.FC = () => {
  const apiService = useApi();
  const [requests, setRequests] = useState<Request[]>([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await apiService.get<Request[]>("/requests/active");
        const reversedRequests = res.reverse();
        setRequests(reversedRequests);
      } catch (error) {
        console.error("Failed to fetch requests:", error);
      }
    };
    fetchRequests();
  }, [apiService]);

  return (
    <>
      <div className="flex flex-col h-screen">
        <LoggedIn />
        <div className="flex overflow-hidden">
          <SideBar />
          {/* Title */}
          <div className="p-8 flex-1">
            <div className="text-left mb-8">
              <h2 className="text-3xl font-bold mb-2">Request Market</h2>
            </div>

            {/* Sticker Wall */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {requests.map((req, index) => (
                <Link key={req.id} href={`/requests/${req.id}`}>
                  <div
                    className={`p-4 rounded-2xl shadow-md transform hover:scale-105 transition-all duration-200 cursor-pointer break-words ${colors[index % colors.length]}`}
                  >
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{req.title}</h3>
                    <p className="text-sm text-gray-700">{req.description || "null"}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RequestMarket;
