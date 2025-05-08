'use client';

import Link from 'next/link';
import '@/styles/globals.css';

export default function LoggedIn() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fffaf0] via-[#e7e7e7] to-[#dceefb]">
      <div className="flex flex-col items-center gap-10">
        <h1 className="text-4xl font-bold text-[#2c3e50] mb-6">KindBridge</h1>

        <div className="flex gap-6">
          {/* Profile */}
          <Link href="/profile">
            <button className="btn btn-primary text-xl font-bold px-10 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 min-w-[200px]">
              My Page
            </button>
          </Link>

          {/* Browse Requests */}
          <Link href="/requests">
            <button className="btn btn-primary text-xl font-bold px-10 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 min-w-[200px]">
              Browse Requests
            </button>
          </Link>

          {/* My Requests */}
          <Link href="/requests/my-requests">
            <button className="btn btn-primary text-xl font-bold px-10 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 min-w-[200px]">
              My Requests
            </button>
          </Link>

          {/* Post Request */}
          <Link href="/requests/post-request">
            <button className="btn btn-primary text-xl font-bold px-10 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 min-w-[200px]">
              Post Request
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
