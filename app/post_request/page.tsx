"use client";

import { useRouter } from "next/navigation";
import { Form, Input, Button, message } from "antd";
import CatCardLayout from "@/components/CatCardLayout";
import { useApi } from "@/hooks/useApi";
import { useState, useEffect } from "react";

const { TextArea } = Input;

export default function PostRequestPage() {
  const [form] = Form.useForm();
  const router = useRouter();
  const api = useApi();
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUserId(parsed?.id || parsed?.userId || null);
    }
  }, []);

  const handleSubmit = async (values: any) => {
    if (!userId) {
      message.error("User ID not found. Please log in again.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/requests", {
        ...values,
        userId, 
      });

      message.success("Request created successfully!");
      router.push(`/my_requests/${userId}`);
    } catch (error) {
      console.error(error);
      message.error("Failed to create request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CatCardLayout title="Post Request">
      <Form
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
        className="space-y-4"
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
          <Input
            placeholder="Contact Info"
            className="rounded-full px-4 py-2"
          />
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

        <div className="flex justify-center gap-6 mt-6">
          <Button
            onClick={() => router.push("/loggedInHome")}
            style={{
              backgroundColor: "#60dbc5",
              color: "white",
              borderRadius: 999,
              width: 120,
            }}
          >
            Cancel
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
            Submit
          </Button>
        </div>
      </Form>
    </CatCardLayout>
  );
}
