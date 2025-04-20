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
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No auth token found.');

        const res = await api.get<RequestItem[]>('/requests', {
          Authorization: `Bearer ${token}`,
        });

        setRequests(res);
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
          onClick={() => router.push('/home')}
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