"use client";

import { useEffect, useState } from "react";
import { Request } from "@/types/request";
import { useApi } from "@/hooks/useApi";
import LoggedIn from "@/components/LoggedIn";
import Link from "next/link";
import SideBar from "@/components/SideBar";
import useLocalStorage from "@/hooks/useLocalStorage";
import { User } from "@/types/user";


const colors = [
  "bg-primary/20", "bg-secondary/20", "bg-accent/20",
  "bg-info/20", "bg-success/20", "bg-warning/20",
  "bg-error/20"
];

const RequestMarket: React.FC = () => {
  const apiService = useApi();
  const [requests, setRequests] = useState<Request[]>([]);
  const { value: user } = useLocalStorage<User | null>("user", null);
  const [search, setSearch] = useState("");
  const [filterEmergencyLevel, setFilterEmergencyLevel] = useState("All");

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

  if (!user) {
    return <div>Loading...</div>;
  }

  const filteredRequests = requests
    .filter(req => req.posterId !== user.id)
    .filter(req => {
      const matchesSearch = req.title?.toLowerCase().includes(search.toLowerCase()) ||
        req.description?.toLowerCase().includes(search.toLowerCase());
      const matchesEmergency = filterEmergencyLevel === "All" ||
        req.emergencyLevel?.toLowerCase() === filterEmergencyLevel.toLowerCase();
      return matchesSearch && matchesEmergency;
    });

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


            {/* Sticker Wall */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6"
              style={{ gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))" }}
            >
              {filteredRequests.map((req) => {
                if (req.id == null) return null;

                const colorClass = colors[req.id % colors.length];

                let badgeClass = "badge badge-outline";
                switch ((req.emergencyLevel || "").toLowerCase()) {
                  case "high":
                    badgeClass += " badge-error";
                    break;
                  case "medium":
                    badgeClass += " badge-warning";
                    break;
                  case "low":
                    badgeClass += " badge-success";
                    break;
                  default:
                    badgeClass += " badge-ghost";
                }

                return (
                  <Link key={req.id} href={`/requests/${req.id}`}>
                    <div
                      className={`w-full p-4 min-h-[130px] rounded-2xl shadow-md transform hover:scale-105 transition-all duration-200 cursor-pointer break-words ${colorClass}`}
                    >
                      <h3 className="text-lg font-bold mb-2">{req.title}</h3>
                      <p className="text-sm">{req.description || "null"}</p>
                      <div className="flex justify-between items-center mt-4">
                        <span className={badgeClass}>
                          {req.emergencyLevel || "Unknown"}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div >
    </>
  );
};

export default RequestMarket;
