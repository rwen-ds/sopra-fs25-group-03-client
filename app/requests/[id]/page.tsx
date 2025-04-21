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
        // uncommentt from here
        // const token = localStorage.getItem('token');
        // if (!token) {
        //   message.error('Please log in to view request details');
        //   router.push('/login');
        //   return;
        // }

        // const res = await api.get<RequestDetail>(`/requests/${id}`, {
        //   Authorization: `${token}`
        // });
        // uncomment till here  

        //delete from here
        // Mock data based on request ID
        let mockRequest;
        if (id === '1') {
          mockRequest = {
            id: '1',
            title: 'Cat Sitting Needed',
            description: 'Looking for a responsible cat sitter for my 2-year-old Persian cat named Luna. Need someone to feed her twice a day, clean her litter box, and spend some playtime with her.',
            contactInfo: 'sarah.miller@email.com | +41 76 123 45 67',
            location: 'Universitätstrasse 6, 8001 Zürich',
            emergencyLevel: 'Normal',
            images: [
              'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba',
              'https://images.unsplash.com/photo-1495360010541-f48722b34f7d',
              'https://images.unsplash.com/photo-1519052537078-e6302a4968d4',
              'https://images.unsplash.com/photo-1511044568932-338cba0ad803',
              'https://images.unsplash.com/photo-1518791841217-8f162f1e1131'
            ]
          };
        } else if (id === '2') {
          mockRequest = {
            id: '2',
            title: 'Help with Grocery Shopping',
            description: 'Need assistance with weekly grocery shopping. I am an elderly person with limited mobility. Looking for someone to help me shop at Migros and carry groceries to my apartment.',
            contactInfo: 'hans.weber@email.com | +41 76 987 65 43',
            location: 'Langstrasse 150, 8004 Zürich',
            emergencyLevel: 'Medium',
            images: [
              'https://images.unsplash.com/photo-1542838132-92c53300491e',
              'https://images.unsplash.com/photo-1506617420156-8e4536971650',
              'https://images.unsplash.com/photo-1579113800032-c38bd7635818',
              'https://images.unsplash.com/photo-1534723452862-4c874018d66d'
            ]
          };
        }

        if (!mockRequest) {
          message.error('Request not found');
          return;
        }
        //delete till here  
        setRequest(mockRequest); //change mockRequest to res
        setMainImage(mockRequest.images[0]); //change mockRequest.images[0] to res.images?.[0] || null
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
         Authorization: `${token}`,
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
    <div style={{ width: '100%', minHeight: '100vh', padding: '2rem' }}>
      <div style={{ 
        display: 'flex',
        maxWidth: '1400px',
        margin: '0 auto',
        gap: '4rem'
      }}>
        {/* Left side - Image gallery */}
        <div style={{ flex: '1', display: 'flex', gap: '2rem' }}>
          {/* Thumbnails */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {request?.images.map((image, index) => (
              <div
                key={index}
                onClick={() => setMainImage(image)}
                style={{
                  width: '100px',
                  height: '100px',
                  cursor: 'pointer',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: mainImage === image ? '2px solid #60dbc5' : '2px solid transparent',
                  backgroundColor: '#f5f5f5'
                }}
              >
                <Image
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  width={100}
                  height={100}
                  style={{ 
                    objectFit: 'cover',
                    width: '100%',
                    height: '100%',
                    borderRadius: '10px'
                  }}
                  preview={false}
                />
              </div>
            ))}
          </div>

          {/* Main image */}
          <div style={{ 
            flex: '1',
            maxWidth: '600px',
            height: '500px',
            borderRadius: '12px',
            overflow: 'hidden',
            backgroundColor: '#f5f5f5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {mainImage && (
              <Image
                src={mainImage}
                alt="Main"
                width={600}
                height={500}
                style={{ 
                  objectFit: 'contain',
                  maxWidth: '100%',
                  maxHeight: '100%',
                  borderRadius: '12px'
                }}
                preview={true}
              />
            )}
          </div>
        </div>

        {/* Right side - Request details */}
        <div style={{ flex: '1', maxWidth: '500px' }}>
          <h1 style={{ 
            fontSize: '28px', 
            fontWeight: '600', 
            marginBottom: '2rem',
            color: '#1a237e'
          }}>
            {request?.title}
          </h1>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <h3 style={{ 
                fontSize: '20px', 
                fontWeight: '600', 
                marginBottom: '0.75rem',
                color: '#1a237e'
              }}>
                Description
              </h3>
              <p style={{ color: '#666', lineHeight: '1.5' }}>{request?.description}</p>
            </div>

            <div>
              <h3 style={{ 
                fontSize: '20px', 
                fontWeight: '600', 
                marginBottom: '0.75rem',
                color: '#1a237e'
              }}>
                Contact Info
              </h3>
              <p style={{ color: '#666', lineHeight: '1.5' }}>{request?.contactInfo}</p>
            </div>

            <div>
              <h3 style={{ 
                fontSize: '20px', 
                fontWeight: '600', 
                marginBottom: '0.75rem',
                color: '#1a237e'
              }}>
                Location
              </h3>
              <p style={{ color: '#666', lineHeight: '1.5' }}>{request?.location}</p>
            </div>

            <div>
              <h3 style={{ 
                fontSize: '20px', 
                fontWeight: '600', 
                marginBottom: '0.75rem',
                color: '#1a237e'
              }}>
                Emergency Level
              </h3>
              <p style={{ color: '#666', lineHeight: '1.5' }}>{request?.emergencyLevel}</p>
            </div>

            <div style={{ 
              display: 'flex', 
              gap: '1rem', 
              marginTop: '1rem',
              flexDirection: 'column'
            }}>
              <Button
                type="primary"
                onClick={handleVolunteer}
                loading={isSubmitting}
                style={{
                  backgroundColor: '#60dbc5',
                  borderColor: '#60dbc5',
                  width: '100%',
                  height: '40px',
                  borderRadius: '24px',
                  fontSize: '16px'
                }}
              >
                volunteer to help
              </Button>
              
              <Button
                onClick={() => router.push('/requests_market')}
                style={{
                  backgroundColor: '#60dbc5',
                  borderColor: '#60dbc5',
                  color: 'white',
                  width: '100%',
                  height: '40px',
                  borderRadius: '24px',
                  fontSize: '16px'
                }}
              >
                back to market
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
