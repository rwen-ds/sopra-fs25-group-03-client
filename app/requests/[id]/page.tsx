'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button, Card, Image, Typography, Spin, message } from 'antd';
import { useApi } from '@/hooks/useApi';

const { Title, Text } = Typography;

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
  const api = useApi();
  const [request, setRequest] = useState<RequestDetail | null>(null);
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await api.get<RequestDetail>(`/requests/${id}`, {
          Authorization: `Bearer ${token}`,
        });
        setRequest(res);
        setMainImage(res.images?.[0] || null);
      } catch (err) {
        message.error('Failed to fetch request details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleVolunteer = async () => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      await api.put(`/requests/${id}/volunteer`, {}, {
        Authorization: `Bearer ${token}`,
      });
      message.success('Application submitted!');
      router.push('/requests_market');
    } catch (err) {
      message.error('Failed to volunteer for this request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen"><Spin /></div>;
  if (!request) return <div className="p-6">No request found</div>;

  return (
    <div className="flex flex-col md:flex-row p-10 gap-10">
      {/* Left thumbnails */}
      <div className="flex md:flex-col gap-2">
        {request.images.map((img, index) => (
          <Image
            key={index}
            src={img}
            width={64}
            height={64}
            preview={false}
            style={{ cursor: 'pointer', borderRadius: 8 }}
            onClick={() => setMainImage(img)}
          />
        ))}
      </div>

      {/* Main image and info */}
      <div className="flex flex-col md:flex-row gap-12 w-full">
        <div className="flex-1">
          {mainImage && (
            <Image
              src={mainImage}
              alt="Main"
              className="rounded-xl"
              width="100%"
            />
          )}
        </div>

        <div className="flex-1">
          <Card title={<Title level={3}>{request.title}</Title>}>
            <div className="space-y-3">
              <div>
                <Text strong>Description:</Text>
                <p>{request.description}</p>
              </div>
              <div>
                <Text strong>Contact Info:</Text>
                <p>{request.contactInfo}</p>
              </div>
              <div>
                <Text strong>Location:</Text>
                <p>{request.location}</p>
              </div>
              <div>
                <Text strong>Emergency Level:</Text>
                <p>{request.emergencyLevel}</p>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <Button
                type="primary"
                loading={isSubmitting}
                onClick={handleVolunteer}
              >
                Volunteer to Help
              </Button>
              <Button onClick={() => router.push('/requests_market')}>
                Back to Market
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
