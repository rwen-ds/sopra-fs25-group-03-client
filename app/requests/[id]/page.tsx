'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface RequestDetail {
  id: string;
  title: string;
  description: string;
  contactInfo: string;
  location: string;
  emergencyLevel: string;
  images: string[];
}

export default function RequestDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [request, setRequest] = useState<RequestDetail | null>(null);
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;

    // require the detailed data
    fetch(`/api/requests/${id}`)
      .then(res => res.json())
      .then(data => {
        setRequest(data);
        setMainImage(data.images?.[0] || null);
      });
  }, [id]);

  const handleVolunteer = async () => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/requests/${id}/volunteer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        alert('You application has been successfully submitted!');
        router.push('/requests_market');
      } else {
        alert('Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to connect to the server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!request) return <div className="p-6">Loading...</div>;

  return (
    <div className="flex p-10 space-x-10">
      {/* pictures in the left side and the main picture */}
      <div className="flex flex-col space-y-2">
        {request.images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt="thumb"
            className="w-16 h-16 object-cover rounded cursor-pointer"
            onClick={() => setMainImage(img)}
          />
        ))}
      </div>

      <div className="flex-1 flex space-x-12">
        <div className="w-1/2">
          {mainImage && (
            <img
              src={mainImage}
              alt="main"
              className="rounded-xl w-full h-auto object-cover"
            />
          )}
        </div>

        {/* information area in the right side */}
        <div className="w-1/2 space-y-4">
          <h1 className="text-2xl font-bold text-indigo-900">Request Title</h1>
          <div>
            <h2 className="font-semibold text-indigo-800">Description</h2>
            <p className="text-gray-400">{request.description}</p>
          </div>
          <div>
            <h2 className="font-semibold text-indigo-800">Contact Info</h2>
            <p className="text-gray-400">{request.contactInfo}</p>
          </div>
          <div>
            <h2 className="font-semibold text-indigo-800">Location</h2>
            <p className="text-gray-400">{request.location}</p>
          </div>
          <div>
            <h2 className="font-semibold text-indigo-800">Emergency Level</h2>
            <p className="text-gray-400">{request.emergencyLevel}</p>
          </div>

          {/* buttons on the bottom */}
          <div className="flex space-x-4 pt-4">
            <button
              onClick={handleVolunteer}
              disabled={isSubmitting}
              className="bg-teal-400 text-white px-6 py-2 rounded-full shadow disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'volunteer to help'}
            </button>
            <button
              onClick={() => router.push('/requests_market')}
              className="bg-teal-400 text-white px-6 py-2 rounded-full shadow"
            >
              back to market
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
