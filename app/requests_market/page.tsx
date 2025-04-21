'use client';

import React, { useEffect, useState } from 'react';
import { Card, Button, Input, Row, Col, message } from 'antd';
import { useRouter } from 'next/navigation';
import { useApi } from '@/hooks/useApi';

interface RequestItem {
  id: string;
  title: string;
  imageUrl?: string;
  type?: string;
}

export default function RequestMarketPage() {
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [search, setSearch] = useState('');
  const api = useApi();
  const router = useRouter();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        // uncomment from here
        // const token = localStorage.getItem('token');
        // if (!token) throw new Error('No auth token found.');

        // const res = await api.get<RequestItem[]>('/requests', {
        //   //Authorization: `Bearer ${token}`,
        //   Authorization: `${token}`
        // });
        // uncomment till here

        // Mock data for development
        //delete from here
        const mockData: RequestItem[] = [
          {
            id: '1',
            title: 'Cat Sitting Needed',
            type: 'Pet Care',
            imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba'
          },
          {
            id: '2',
            title: 'Help with Grocery Shopping',
            type: 'Daily Tasks',
            imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e'
          },
          {
            id: '3',
            title: 'English Tutoring',
            type: 'Education',
            imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b'
          },
          {
            id: '4',
            title: 'Garden Maintenance',
            type: 'Outdoor Work',
            imageUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae'
          },
          {
            id: '5',
            title: 'Senior Companionship',
            type: 'Healthcare',
            imageUrl: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289'
          },
          {
            id: '6',
            title: 'Computer Setup Assistance',
            type: 'Technical',
            imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97'
          },
          {
            id: '7',
            title: 'Moving Help Needed',
            type: 'Physical Help',
            imageUrl: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115'
          },
          {
            id: '8',
            title: 'Dog Walking',
            type: 'Pet Care',
            imageUrl: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1'
          },
          {
            id: '9',
            title: 'Math Homework Help',
            type: 'Education',
            imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb'
          }
        ];
        //delete till here
        
        setRequests(mockData); //change mockData to res
      } catch (err) {
        console.error(err);
        message.error('Failed to load requests');
      }
    };

    fetchRequests();
  }, []);

  const filtered = requests.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div style={{ padding: '2rem' }}>
      {/* Top Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <Button
          type="default"
          onClick={() => router.push('/loggedInHome')}
          style={{
            backgroundColor: '#60dbc5',
            color: 'white',
            borderRadius: '24px',
            padding: '0 24px',
          }}
        >
          HOME
        </Button>

        <div style={{ display: 'flex', gap: '1rem', flex: 1, marginLeft: '2rem' }}>
          <Button> Add Filter </Button>
          <Input
            placeholder="Search for a request by name or keyword"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Grid of Cards */}
      <Row gutter={[24, 24]}>
        {filtered.map((req) => (
          <Col key={req.id} xs={24} sm={12} md={8}>
            <Card
              hoverable
              onClick={() => router.push(`/requests/${req.id}`)}
              style={{ cursor: 'pointer' }}
              cover={
                req.imageUrl ? (
                  <img
                    src={req.imageUrl}
                    alt={req.title}
                    style={{ height: 200, objectFit: 'cover' }}
                  />
                ) : (
                  <div
                    style={{
                      height: 200,
                      backgroundColor: '#f5f5f5',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      color: '#aaa',
                    }}
                  >
                    No image
                  </div>
                )
              }
            >
              <Card.Meta
                title={<span style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>{req.title}</span>}
                description={req.type && <span style={{ color: '#888' }}>{req.type}</span>}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}