"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Descriptions, message } from "antd";
import CatCardLayout from "@/components/CatCardLayout";
import { useApi } from "@/hooks/useApi";

interface RequestDetail {
  title: string;
  description: string;
  contactInfo: string;
  location: string;
  emergencyLevel: string;
}

export default function DeleteRequestPage() {
  const { id } = useParams(); // requestId
  const router = useRouter();
  const api = useApi();

  const [request, setRequest] = useState<RequestDetail | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsed = JSON.parse(stored);
      setUserId(parsed?.id || parsed?.userId);
    }

    const fetchData = async () => {
      try {
        const data = await api.get<RequestDetail>(`/requests/${id}`);
        setRequest(data);
      } catch (err) {
        message.error("Failed to load request.");
      }
    };

    fetchData();
  }, [id]);

  const handleDelete = async () => {
    if (!id || !userId) return;

    setLoading(true);
    try {
      await api.delete(`/requests/${id}`);
      message.success("Request deleted successfully.");
      router.push(`/my_requests/${userId}`);
    } catch {
      message.error("Failed to delete request.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push(`/edit_request/${id}`);
  };

  return (
    <CatCardLayout title="Delete Request">
      {request ? (
        <>
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="Title">{request.title}</Descriptions.Item>
            <Descriptions.Item label="Description">{request.description}</Descriptions.Item>
            <Descriptions.Item label="Contact Info">{request.contactInfo}</Descriptions.Item>
            <Descriptions.Item label="Location">{request.location}</Descriptions.Item>
            <Descriptions.Item label="Emergency Level">{request.emergencyLevel}</Descriptions.Item>
          </Descriptions>

          <div className="flex justify-center gap-6 mt-8">
            <Button
              onClick={handleDelete}
              danger
              loading={loading}
              style={{
                backgroundColor: "#60dbc5",
                color: "white",
                borderRadius: 999,
                width: 160,
                fontWeight: 500,
              }}
            >
              Confirm Deletion
            </Button>
            <Button
              onClick={handleCancel}
              style={{
                backgroundColor: "#cbd5e1",
                color: "#000",
                borderRadius: 999,
                width: 160,
              }}
            >
              Cancel Deletion
            </Button>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </CatCardLayout>
  );
}
