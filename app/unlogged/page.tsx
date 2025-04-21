"use client";

import { useRouter } from "next/navigation";
import { Button } from "antd";
import Image from "next/image";

export default function UnloggedHome() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gray-100 px-8 py-14 flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-6xl flex justify-between items-center mb-20">
        {/* Logo + Requests */}
        <div className="flex items-center gap-12">
          <h1 className="text-xl font-bold text-indigo-900">KindBridge</h1>
          <button
            onClick={() => router.push("/requests_market")}
            className="text-gray-400 hover:text-indigo-900 transition text-sm"
          >
            Requests
          </button>
        </div>

        {/* Login + Sign Up */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/login")}
            className="text-sm text-gray-600 hover:text-indigo-700 transition"
          >
            Login
          </button>
          <Button
            onClick={() => router.push("/sign_up")}
            className="text-sm"
            style={{
              backgroundColor: "#60dbc5",
              color: "white",
              borderRadius: "24px",
              fontWeight: 500,
              padding: "0 20px",
              height: "32px",
              border: "none",
            }}
          >
            Sign Up
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-12 items-center justify-between">
        {/* Left side: headline */}
        <div className="max-w-xl">
          <h2 className="text-3xl font-bold text-indigo-900 leading-snug">
            A community-driven platform designed to connect students who need help with those willing to lend a hand
          </h2>
        </div>

        {/* Right side: image + description */}
        <div className="flex flex-col items-center text-center max-w-sm">
          <Image
            src="/cat_background.jpg"
            alt="cat"
            width={300}
            height={200}
            className="rounded-md object-cover"
          />
          <p className="text-gray-400 mt-4 text-sm leading-relaxed">
            Our motivation is to provide a transparent, efficient, and user-friendly platform that bridges the gap
            between those who need help and those who can offer it, promoting kindness and support within the student
            community.
          </p>
        </div>
      </div>
    </main>
  );
}
