"use client";

import { useRouter } from "next/navigation";
import { Button } from "antd";
import Image from "next/image";

export default function UnloggedHome() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gray-100 px-6 py-10 flex flex-col items-center">
      {/* header */}
      <div className="w-full max-w-6xl flex justify-between items-center mb-12">
        <div className="flex items-center gap-12">
          <h1 className="text-2xl font-bold text-indigo-900">KindBridge</h1>
          <button
            onClick={() => router.push("/request_market")}
            className="text-gray-400 hover:text-black transition"
          >
            Requests
          </button>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/login")}
            className="text-gray-700 hover:text-indigo-700 font-medium transition"
          >
            Login
          </button>
          <Button
            onClick={() => router.push("/signup")}
            style={{
              backgroundColor: "#60dbc5",
              color: "white",
              borderRadius: "24px",
              fontWeight: 500,
              padding: "0 16px",
              border: "none",
            }}
          >
            Sign Up
          </Button>
        </div>
      </div>

      {/* introduction */}
      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-10 justify-between items-center">
        {/* leftsidewords */}
        <div className="max-w-lg">
          <h2 className="text-3xl font-bold text-indigo-900 leading-snug mb-6">
            A community-driven platform designed to connect students who need help with those willing to lend a hand
          </h2>
        </div>

        {/* right */}
        <div className="flex flex-col items-center">
          <Image
            src="/cat_background.jpg"
            alt="cat"
            width={300}
            height={200}
            className="rounded-md object-cover"
          />
          <p className="text-gray-500 mt-4 text-sm max-w-sm text-center">
            Our motivation is to provide a transparent, efficient, and user-friendly platform that bridges the gap
            between those who need help and those who can offer it, promoting kindness and support within the student
            community.
          </p>
        </div>
      </div>
    </main>
  );
}
