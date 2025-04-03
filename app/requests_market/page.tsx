'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface RequestItem {
  id: string;
  title: string;
  imageUrl?: string;
  type?: string;
}

export default function RequestMarketPage() {
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    // get available requests from backend
    fetch('/api/requests/available')
      .then(res => res.json())
      .then(data => setRequests(data));
  }, []);

  return (
    <div className="p-6">
      {/* Top bar with HOME, Filter, Search */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => router.push('/home')}
          className="bg-teal-400 text-white px-4 py-2 rounded-full"
        >
          HOME
        </button>

        <div className="flex items-center space-x-4 flex-1 ml-6">
          <button className="bg-gray-100 px-4 py-2 rounded whitespace-nowrap">Add filter</button>
          <input
            type="text"
            placeholder="Search for a request by name or keyword"
            className="border rounded px-4 py-2 w-full"
          />
        </div>
      </div>

      {/* Grid to show all available requests */}
      <div className="grid grid-cols-3 gap-6">
        {requests.map((req) => (
          <div key={req.id} className="text-center">
            <div className="h-48 bg-gray-100 flex items-center justify-center rounded overflow-hidden mb-2">
              {req.imageUrl ? (
                <img src={req.imageUrl} alt={req.title} className="object-cover h-full w-full" />
              ) : (
                <span className="text-gray-400">No image</span>
              )}
            </div>
            <div className="font-bold text-indigo-900 uppercase">{req.title}</div>
            {req.type && (
              <div className="text-sm text-gray-500 mt-1">{req.type}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
