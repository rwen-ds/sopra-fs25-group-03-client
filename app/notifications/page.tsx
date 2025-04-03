'use client';

import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { usePathname, useRouter } from 'next/navigation';

const socket = io('http://localhost:3001'); // connet to socket server from backend

interface Notification {
  id: string;
  message: string;
  type: 'application' | 'accepted' | 'completed';
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // build connection
    socket.on('connect', () => {
      console.log('Connected to socket server');
    });

    socket.on('new-notification', (data: Notification) => {
      setNotifications((prev) => [data, ...prev]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const renderNotification = (notification: Notification) => {
    const { id, message, type } = notification;

    return (
      <div
        key={id}
        className="border border-gray-300 rounded-xl p-4 flex justify-between items-center shadow-sm"
      >
        <span>{message}</span>
        {type === 'application' && (
          <div className="space-x-2">
            <button className="bg-blue-500 text-white px-4 py-1 rounded">Chat</button>
            <button className="bg-blue-500 text-white px-4 py-1 rounded">Accept</button>
          </div>
        )}
        {type === 'accepted' && (
          <div className="space-x-2">
            <button className="bg-blue-500 text-white px-4 py-1 rounded">Chat</button>
            <button className="bg-blue-500 text-white px-4 py-1 rounded">Completed</button>
          </div>
        )}
        {type === 'completed' && (
          <button className="bg-blue-500 text-white px-4 py-1 rounded">
            Go to mark as done
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-screen">
      {/* left side (navigation) */}
      <div className="w-20 bg-white border-r flex flex-col items-center py-6 space-y-6">
        <button
          onClick={() => router.push('/home')}
          className="bg-teal-400 text-white px-4 py-2 rounded-full text-sm"
        >
          HOME
        </button>

        <button
          onClick={() => router.push('/messages')}
          className={`text-xl ${pathname === '/messages' ? 'text-blue-500' : 'text-gray-400'}`}
        >
          💬
        </button>

        <button
          className={`text-xl ${pathname === '/notifications' ? 'text-blue-500' : 'text-gray-400'}`}
        >
          🔔
        </button>
      </div>

      {/* right side */}
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Notifications</h1>
        <div className="space-y-4">
          {notifications.length > 0 ? (
            notifications.map(renderNotification)
          ) : (
            <p className="text-gray-500">No notifications yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

