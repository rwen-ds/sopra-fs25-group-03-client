"use client";

import { useEffect, useState } from "react";
import { Request } from "@/types/request";
import { useApi } from "@/hooks/useApi";
import LoggedIn from "@/components/LoggedIn";
import Link from "next/link";
import SideBar from "@/components/SideBar";

const colors = [
  "bg-primary/20", "bg-secondary/20", "bg-accent/20",
  "bg-info/20", "bg-success/20", "bg-warning/20",
  "bg-error/20"
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
              <h2 className="text-xl font-bold mb-2">Request Market</h2>
            </div>

            {/* Sticker Wall */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {requests.map((req) => {
                if (req.id == null) return null;

                const colorClass = colors[req.id % colors.length];

                return (
                  <Link key={req.id} href={`/requests/${req.id}`}>
                    <div
                      className={`p-4 min-h-[130px] rounded-2xl shadow-md transform hover:scale-105 transition-all duration-200 cursor-pointer break-words ${colorClass}`}
                    >
                      <h3 className="text-lg font-bold mb-2">{req.title}</h3>
                      <p className="text-sm">{req.description || "null"}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RequestMarket;
