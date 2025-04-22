// app/admin/page.tsx
'use client';

import React from 'react';

export default function AdminDashboard() {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white flex flex-col p-4">
        <div className="flex flex-col items-center space-y-2 mb-8">
          {/* <img
            src="https://i.imgur.com/JSCHt4R.png"
            className="rounded-full w-20 h-20"
            alt="Admin Avatar"
          /> */}
          <div className="text-lg font-semibold">AdminName</div>
        </div>

        <nav className="flex flex-col space-y-4">
          <a href="/admin" className="bg-blue-700 px-3 py-2 rounded">Dashboard</a>
          <a href="/admin/users" className="hover:bg-blue-700 px-3 py-2 rounded">Users</a>
          <a href="/admin/requests" className="hover:bg-blue-700 px-3 py-2 rounded">Requests</a>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-white p-12 relative">
        {/* 🔔 + Logout */}
        <div className="absolute top-6 right-6 flex items-center space-x-4">
          <button className="text-xl">🔔</button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded">Log out</button>
        </div>
        {/* "welcome" + email address */}
        <h1 className="text-2xl font-bold mb-2">Welcome to your dashboard, AdminName</h1>
        <p className="text-gray-600">admin@email.com</p>
      </main>
    </div>
  );
}
