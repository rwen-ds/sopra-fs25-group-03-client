"use client";

import { useEffect, useState } from "react";
import { Request } from "@/types/request";
import { useApi } from "@/hooks/useApi";
import Link from "next/link";
import SideBar from "@/components/SideBar";
import useLocalStorage from "@/hooks/useLocalStorage";
import { User } from "@/types/user";
import { useGeolocation } from "@/hooks/useGeolocation";
import { calculateDistance } from "@/utils/distance";
import { LocationPermissionPrompt } from "@/components/LocationPermissionPrompt";
import { MapToggleButton } from "@/components/MapToggleButton";
import { RequestsMap } from "@/components/RequestsMap";

const RequestMarket: React.FC = () => {
  const apiService = useApi();
  const [requests, setRequests] = useState<Request[]>([]);
  const { value: user } = useLocalStorage<User | null>("user", null);
  const [search, setSearch] = useState("");
  const [filterEmergencyLevel, setFilterEmergencyLevel] = useState("All");
  const [filterCountry, setFilterCountry] = useState("All");
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  const [isMapView, setIsMapView] = useState(false);

  const { latitude: userLat, longitude: userLon, error: locationError } = useGeolocation();

  useEffect(() => {
    const permission = localStorage.getItem('locationPermission');
    if (permission === 'denied') return;

    if (permission === null) {
      setShowLocationPrompt(true);
    }
  }, []);

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
      const matchesCountry = filterCountry === "All" ||
        req.countryCode === filterCountry;
      return matchesSearch && matchesEmergency && matchesCountry;
    });

  return (
    <>
      <div className="flex flex-col h-screen">
        <div className="flex overflow-hidden">
          <SideBar />
          {/* Title */}
          <div className="p-8 flex-1">
            {showLocationPrompt && (
              <LocationPermissionPrompt
                onAccept={() => {
                  localStorage.setItem('locationPermission', 'granted');
                }}
                onDeny={() => {
                  localStorage.setItem('locationPermission', 'denied');
                }}
              />
            )}
            <div className="text-left mb-8 mt-10">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold mb-2">Request Market</h2>
                {/* <MapToggleButton
                  isMapView={isMapView}
                  toggleView={() => setIsMapView(!isMapView)}
                /> */}
              </div>
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
              <select
                className="select w-full sm:w-48"
                value={filterCountry}
                onChange={(e) => setFilterCountry(e.target.value)}
              >
                <option value="All">All Countries</option>
                <option value="CH">Switzerland</option>
                <option value="DE">Germany</option>
                <option value="IT">Italy</option>
                <option value="FR">France</option>
              </select>
              <button
                className="btn btn-outline btn-sm w-full sm:w-auto"
                onClick={() => {
                  setSearch('');
                  setFilterEmergencyLevel('All');
                  setFilterCountry('All');
                }}
              >
                Clear Filters
              </button>
              <div className="mr-auto">
                <MapToggleButton
                  isMapView={isMapView}
                  toggleView={() => setIsMapView(!isMapView)}
                />
              </div>
            </div>

            {isMapView ? (
              <RequestsMap
                requests={filteredRequests}
                userLat={userLat}
                userLon={userLon}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {/* Sticker Wall */}
                {filteredRequests.map((req) => {
                  if (req.id == null) return null;
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
                      <div className="w-full p-4 min-h-[130px] rounded-2xl shadow-md transform hover:scale-105 transition-all duration-200 cursor-pointer break-words border relative group">
                        {req.publishedAt && (
                          <span className="absolute top-3 right-3 text-xs text-gray-400 bg-white/80 backdrop-blur-sm px-2 py-1">
                            {new Date(req.publishedAt).toLocaleString('en-US', {
                              timeZone: 'Europe/Zurich',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        )}

                        <h3 className="text-lg font-bold mb-2 pr-10">{req.title}</h3>
                        <p className="text-sm text-gray-600">{req.description || "No description"}</p>

                        <div className="flex justify-between items-center mt-4">
                          <span className={badgeClass}>
                            {req.emergencyLevel || "Unknown"}
                          </span>
                          <span className="text-xs text-gray-500">
                            {calculateDistance(
                              userLat,
                              userLon,
                              req.latitude,
                              req.longitude,
                              locationError ? "Enable location" : "Loading..."
                            )}
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default RequestMarket;
