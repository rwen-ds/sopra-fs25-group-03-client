'use client';

import Link from 'next/link';
import SideBar from '@/components/SideBar';  
import '@/styles/globals.css';
import { useEffect, useState } from 'react';
import { useApi } from '@/hooks/useApi';
import { Request } from "@/types/request";

interface ScrollingEntry {
  id: number;
  content: string;
  isDefault?: boolean;
}


export default function LoggedIn() {
  const [scrollingItems, setScrollingItems] = useState<ScrollingEntry[]>([]);
  const apiService = useApi();

  const defaultMessages: ScrollingEntry[] = [
    { id: -1, content: "Welcome to KindBridge 💛", isDefault: true },
    { id: -2, content: "Be the bridge someone needs today 🌉", isDefault: true },
    { id: -3, content: "Kindness always returns 💫", isDefault: true },
  ];

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const all = await apiService.get<Request[]>('/requests');
        const items = all
       .filter((r) => r.id !== null)
       .map((req) => ({
       id: req.id as number, 
       content: `💬 ${req.title} – ${req.description}`,
      }));
        setScrollingItems(items.length > 0 ? items : defaultMessages);
      } catch (e) {
        setScrollingItems(defaultMessages);
        console.error("⚠️ Failed to fetch requests:", e);
      }
    };
  
    fetchRequests();
  }, []);
  return (
    <div className="min-h-screen flex relative bg-gradient-to-br from-[#fffaf0] via-[#e7e7e7] to-[#dceefb]">
      <SideBar />

      <div className="flex-1 flex flex-col items-center justify-center p-10">
        <div className="flex flex-col items-center gap-10">
          <h1 className="text-4xl font-bold text-[#2c3e50] mb-6">KindBridge</h1>

          <div className="flex gap-4">
            {/* Profile */}
            <Link href="/profile">
              <button className="btn btn-neutral shadow-md px-6">
                My Page
              </button>
            </Link>

            {/* Browse Requests */}
            <Link href="/requests">
              <button className="btn btn-neutral shadow-md px-6">
                Browse Requests
              </button>
            </Link>

            {/* My Requests */}
            <Link href="/requests/my-requests">
              <button className="btn btn-neutral shadow-md px-6">
                My Requests
              </button>
            </Link>

            {/* Post Request */}
            <Link href="/requests/post-request">
              <button className="btn btn-neutral shadow-md px-6">
                Post Request
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* ✅ Feedback scroll bar at the bottom */}
      <div className="absolute bottom-0 left-0 w-full h-12 overflow-hidden bg-white bg-opacity-70 z-0">
       <div className="feedback-track whitespace-nowrap h-full flex items-center animate-scroll">
        {scrollingItems.map((f) =>
        f.isDefault ? (
          <span key={f.id} className="mx-6 shrink-0">
            💬 "{f.content}"
          </span>
        ) : (
          <Link key={f.id} href={`/requests/${f.id}`} className="mx-6 shrink-0 hover:underline">
            💬 "{f.content}"
          </Link>
       )
        )}
      </div>
     </div>
    </div>
  );
}
