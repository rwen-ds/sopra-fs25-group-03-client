'use client';

import Link from 'next/link';
import SideBar from '@/components/SideBar';
import '@/styles/globals.css';
import useAuthRedirect from "@/hooks/useAuthRedirect";
import useLocalStorage from "@/hooks/useLocalStorage";
import { FaUser, FaSearch, FaClipboardList, FaPlusCircle } from 'react-icons/fa';

export default function LoggedIn() {
  const { value: token } = useLocalStorage<string | null>('token', null);
  useAuthRedirect(token)

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#fffaf0] via-[#e7e7e7] to-[#dceefb]">
      <SideBar />

      <div className="flex-1 flex flex-col items-center justify-center p-10">
        <div className="flex flex-col items-center gap-10">
          <h1 className="text-4xl font-bold text-[#2c3e50] mb-6">KindBridge</h1>

          <div className="flex gap-4">
            {/* Profile */}
            <Link href="/profile">
              <button className="btn btn-neutral shadow-md px-6">
                <FaUser />My Page
              </button>
            </Link>

            {/* Browse Requests */}
            <Link href="/requests">
              <button className="btn btn-neutral shadow-md px-6">
                <FaSearch />Browse Requests
              </button>
            </Link>

            {/* My Requests */}
            <Link href="/requests/my-requests">
              <button className="btn btn-neutral shadow-md px-6">
                 <FaClipboardList />My Requests
              </button>
            </Link>

            {/* Post Request */}
            <Link href="/requests/post-request">
              <button className="btn btn-neutral shadow-md px-6">
                <FaPlusCircle />Post Request
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
