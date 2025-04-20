"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Form, Input, Button, message } from "antd";
import CatCardLayout from "@/components/CatCardLayout";
import { useApi } from "@/hooks/useApi";

const { TextArea } = Input;

export default function EditRequestPage() {
  const { id } = useParams(); // requestId
  const router = useRouter();
  const api = useApi();

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // preload the data
  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const data = await api.get(`/requests/${id}`);
        form.setFieldsValue(data);
      } catch {
        message.error("Failed to load request data.");
      }
    };

    const user = localStorage.getItem("user");
    if (user) {
      const parsed = JSON.parse(user);
      setUserId(parsed?.id || parsed?.userId);
    }

    fetchRequest();
  }, [id]);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      await api.put(`/requests/${id}`, values);
      message.success("Request updated!");
      router.push(`/my_requests/${userId}`);
    } catch {
      message.error("Update failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CatCardLayout title="Edit Request">
      <Form
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
        style={{ width: "100%" }}
      >
        <Form.Item
          name="title"
          rules={[{ required: true, message: "Please enter the title" }]}
        >
          <Input placeholder="Title" className="rounded-full px-4 py-2" />
        </Form.Item>

        <Form.Item
          name="description"
          rules={[{ required: true, message: "Please enter description" }]}
        >
          <TextArea
            rows={4}
            placeholder="Description"
            className="rounded-2xl px-4 py-2"
          />
        </Form.Item>

        <Form.Item
          name="contactInfo"
          rules={[{ required: true, message: "Please enter contact info" }]}
        >
          <Input placeholder="Contact Info" className="rounded-full px-4 py-2" />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="location"
            rules={[{ required: true, message: "Please enter location" }]}
          >
            <Input placeholder="Location" className="rounded-full px-4 py-2" />
          </Form.Item>

          <Form.Item
            name="emergencyLevel"
            rules={[{ required: true, message: "Please enter emergency level" }]}
          >
            <Input
              placeholder="Emergency Level"
              className="rounded-full px-4 py-2"
            />
          </Form.Item>
        </div>

        {/* buttons in the bottom */}
        <div className="flex justify-center gap-6 mt-6">
          <Button
            danger
            onClick={() => router.push(`/delete_request/${id}`)}
            style={{
              backgroundColor: "#cbd5e1",
              color: "#000",
              borderRadius: 999,
              width: 120,
            }}
          >
            Delete
          </Button>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            style={{
              backgroundColor: "#60dbc5",
              color: "white",
              borderRadius: 999,
              width: 120,
              border: "none",
            }}
          >
            Edit
          </Button>
        </div>
      </Form>
    </CatCardLayout>
  );
}
