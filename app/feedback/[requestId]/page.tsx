'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useApi } from "@/hooks/useApi";
import CatCardLayout from '@/components/CatCardLayout';
import { Button, Form, Input } from 'antd';

const { TextArea } = Input;

export default function FeedbackPage() {
  const { requestId } = useParams();
  const router = useRouter();
  const api = useApi();

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (!requestId) return;

    const fetchRequestTitle = async () => {
      try {
        const res = await api.get<{ title: string }>(`/requests/${requestId}`);
        setTitle(res.title || 'Request');
      } catch (err) {
        console.error('Failed to fetch request title:', err);
        setTitle('Request not found');
      }
    };

    fetchRequestTitle();
  }, [requestId, api]);

  const handleSubmit = async (values: { feedback: string }) => {
    if (!values.feedback.trim()) {
      alert('Feedback cannot be empty.');
      return;
    }

    try {
      setLoading(true);
      await api.post(`/requests/${requestId}/feedback`, {
        message: values.feedback,
      });
      alert('Feedback submitted successfully!');
      router.push('/');
    } catch (err) {
      console.error('Failed to submit feedback:', err);
      alert('Failed to submit feedback.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CatCardLayout title="Feedback">
      <div style={{ textAlign: 'center', marginBottom: 16, textTransform: 'uppercase', color: '#999', fontWeight: 500 }}>
        {title || 'Request Title'}
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        size="large"
        style={{ width: '100%' }}
      >
        <Form.Item
          name="feedback"
          rules={[{ required: true, message: 'Please enter your feedback' }]}
        >
          <TextArea
            placeholder="Add feedback for this request"
            autoSize={{ minRows: 5, maxRows: 8 }}
            style={{
              borderRadius: '20px',
              padding: '12px 16px',
              resize: 'none',
              fontSize: '15px',
            }}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            style={{
              width: '100%',
              borderRadius: '24px',
              backgroundColor: '#60dbc5',
              border: 'none',
              fontWeight: 600,
            }}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </CatCardLayout>
  );
}
