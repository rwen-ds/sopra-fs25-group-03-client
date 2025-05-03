'use client';

import "@ant-design/v5-patch-for-react-19";
import Link from 'next/link';
import '@/styles/globals.css';
import SideBar from "@/components/SideBar";
import Header from "@/components/LoggedIn";

export default function LoggedIn() {
  return (
    <>
      <div className="flex flex-col h-screen">
        {/* Header */}
        <Header />

        {/* Body: Sidebar + Main Content */}
        <div className="flex flex-1 overflow-hidden">
          <SideBar />

          {/* Main Content */}
          <div className="flex flex-1 p-8 justify-evenly items-center">
            <section className="logged-buttons flex gap-6 justify-evenly items-center w-full">
              {/* Browse Requests Button */}
              <div className="tooltip tooltip-top" data-tip="Browse Requests">
                <Link href="/requests">
                  <button
                    className="btn btn-circle btn-success text-white text-2xl w-20 h-20"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75 2.25 12l4.179 2.25m0-4.5 5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0 4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0-5.571 3-5.571-3" />
                    </svg>
                  </button>
                </Link>
              </div>

              {/* My Requests Button */}
              <div className="tooltip tooltip-top" data-tip="My Requests">
                <Link href="/requests/my-requests">
                  <button
                    className="btn btn-circle btn-success text-white text-2xl w-20 h-20"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 6h14M5 12h14M5 18h14" />
                    </svg>
                  </button>
                </Link>
              </div>

              {/* Post New Request Button */}
              <div className="tooltip tooltip-top" data-tip="Post New Request">
                <Link href="/requests/post-request">
                  <button
                    className="btn btn-circle btn-success text-white text-2xl w-20 h-20"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16M4 12h16" />
                    </svg>
                  </button>
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
