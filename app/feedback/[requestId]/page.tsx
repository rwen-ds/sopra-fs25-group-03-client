'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useApi } from "@/hooks/useApi";

export default function FeedbackPage() {
  const { requestId } = useParams();
  const router = useRouter();
  const api = useApi();
  type RequestType = { id: number; title: string; feedback?: string; };

  const [feedback, setFeedback] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (!requestId) return;

    const fetchRequestTitle = async () => {
      try {
        const res = await api.get<RequestType>(`/requests/${requestId}`);
        setTitle(res.title || 'Request');
      } catch (err) {
        console.error('Failed to fetch request title:', err);
        setTitle('Request not found');
      }
    };

    fetchRequestTitle();
  }, [requestId, api]);

  const handleSubmit = async () => {
    if (!feedback.trim()) {
      alert('Feedback cannot be empty.');
      return;
    }

    try {
      const res = await fetch(`/api/requests/${requestId}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: feedback }),
      });

      if (res.ok) {
        alert('Feedback submitted successfully!');
        router.push('/'); // or redirect to homepage or request list
      } else {
        alert('Failed to submit feedback.');
      }
    } catch (err) {
      console.error(err);
      alert('Server error.');
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: `url('https://i.imgur.com/JSCHt4R.png')` }}>
      <div className="bg-white p-8 rounded-xl shadow-lg w-[500px] max-w-full">
        <h1 className="text-2xl font-bold text-center mb-6">Feedback</h1>

        <div className="text-center text-sm text-gray-400 uppercase tracking-widest mb-2">
          {title || 'Request Title'}
        </div>

        <label className="block font-semibold text-indigo-900 mb-2">Feedback</label>
        <textarea
          className="w-full h-40 p-4 border rounded-lg resize-none text-gray-700"
          placeholder="Add feedback for this request"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-teal-400 text-white py-2 mt-6 rounded-full shadow hover:bg-teal-500"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
