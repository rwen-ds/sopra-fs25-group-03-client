//by NanxinWANG 
// (This page is not INCLUDED IN SPRINT1, JUST FOR ONLCIK LOGIC)
"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "antd";

interface Request {
  id: string;
  title: string;
  images?: string[];
}

export default function MyRequestsPage() {
  const { id } = useParams(); // userId
  const router = useRouter();
  const [requests, setRequests] = useState<Request[]>([]);

  useEffect(() => {
    fetch(`/api/users/${id}/requests`)
      .then((res) => res.json())
      .then((data) => setRequests(data))
      .catch(() => console.error("Failed to load requests"));
  }, [id]);

  return (
    <div className="p-8 min-h-screen bg-white">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-700">My Requests</h1>
        <Button
          onClick={() => router.push("/loggedInHome")}
          style={{
            backgroundColor: "#60dbc5",
            color: "white",
            borderRadius: "24px",
          }}
        >
          HOME
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {requests.map((req) => (
          <div
            key={req.id}
            className="rounded-xl shadow-md border p-4 flex flex-col items-center"
          >
            <img
              src={req.images?.[0] || "/placeholder.jpg"} //nanixn: the imgae shown in requests card（stored in /public,can be changed）
              alt="request"
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h3 className="text-lg font-semibold text-center mb-4 uppercase">
              {req.title}
            </h3>
            <div className="flex gap-4">
              <Button
                onClick={() => router.push(`/edit_request/${req.id}`)}
                style={{
                  backgroundColor: "#60dbc5",
                  color: "white",
                  borderRadius: "24px",
                  minWidth: "80px",
                }}
              >
                Edit
              </Button>
              <Button
                onClick={() => router.push(`/feedback/${req.id}`)}
                style={{
                  backgroundColor: "#60dbc5",
                  color: "white",
                  borderRadius: "24px",
                  minWidth: "80px",
                }}
              >
                Done
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
