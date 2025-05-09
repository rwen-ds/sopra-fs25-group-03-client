'use client';

import Link from 'next/link';
import '@/styles/globals.css';

export default function LoggedIn() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fffaf0] via-[#e7e7e7] to-[#dceefb]">
      <div className="flex flex-col items-center gap-10">
        <h1 className="text-4xl font-bold text-[#2c3e50] mb-6">KindBridge</h1>

        <div className="flex gap-4">
          {/* Profile */}
          <Link href="/profile">
            <button className="btn btn-primary rounded-full shadow-md px-6" data-theme="forest">
              My Page
            </button>
          </Link>

          {/* Browse Requests */}
          <Link href="/requests">
            <button className="btn btn-secondary rounded-full shadow-md px-6" data-theme="forest">
              Browse Requests
            </button>
          </Link>

          {/* My Requests */}
          <Link href="/requests/my-requests">
            <button className="btn btn-accent rounded-full shadow-md px-6" data-theme="forest">
              My Requests
            </button>
          </Link>

          {/* Post Request */}
          <Link href="/requests/post-request">
            <button className="btn btn-neutral rounded-full shadow-md px-6" data-theme="forest">
              Post Request
            </button>
          </Link>

        </div>

      </div>
    </div>
  );
}
