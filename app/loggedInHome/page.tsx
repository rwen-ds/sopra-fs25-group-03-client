'use client';

import { useRouter } from 'next/navigation';
import { Button } from 'antd';
import { useEffect, useState } from 'react';

export default function LoggedInHome() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);

  
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUserId(parsed?.id || parsed?.userId || null); 
    }
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-6">
      {/* Header */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-16">
        <h1 className="text-2xl font-bold text-indigo-900">KindBridge</h1>
        <Button
          type="link"
          onClick={() => router.push("/requests_market")}
          style={{ color: "#8e8e8e", fontWeight: 500 }}
        >
          Requests
        </Button>
      </div>

      {/* Main Buttons */}
      <div className="flex flex-wrap justify-center gap-8">
        <Button
          onClick={() => router.push("/profile")}
          style={buttonStyle}
        >
          My Profile
        </Button>

        <Button
          onClick={() => {
            if (userId) {
              router.push(`/my_requests/${userId}`);
            } else {
              alert("User ID not found.");
            }
          }}
          style={buttonStyle}
        >
          My Requests
        </Button>

        <Button
          onClick={() => router.push("/post_request")}
          style={buttonStyle}
        >
          Post Request
        </Button>
      </div>
    </main>
  );
}

const buttonStyle: React.CSSProperties = {
  backgroundColor: "#60dbc5",
  color: "white",
  borderRadius: "999px",
  padding: "0 24px",
  fontWeight: 500,
  height: "40px",
  border: "none",
};
