"use client";

import { useState, useEffect } from "react";
import { Form, Input, Select, Button, Avatar, Typography, message } from "antd";
import { useRouter } from "next/navigation";
import ProfileMessNotiLayout from "@/components/ProfileMessNotiLayout";
import { UserOutlined, MailOutlined } from "@ant-design/icons";

const mockUser = {
  name: "Yanjun Guo",
  email: "yanjun.guo@uzh.ch",
  gender: "Female",
  age: "22",
  language: "English",
  avatar: "/cat_background.jpg", 
};

export default function ProfilePage() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [editing, setEditing] = useState(false);
  const [userData, setUserData] = useState(mockUser);

  useEffect(() => {
    form.setFieldsValue(userData); // original value 
  }, [userData]);

  const handleEdit = async () => {
    try {
      const values = await form.validateFields();
      console.log("Send to server:", values);
      setUserData(values); // update values
      setEditing(false);
      message.success("Profile updated!");
    } catch (err) {
      console.log("Validation failed:", err);
    }
  };

  const handleCancel = () => {
    form.setFieldsValue(userData); 
    setEditing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/unlogged"); 
  };

  return (
    <ProfileMessNotiLayout activeKey="profile">
      <div className="flex items-center gap-4 mb-6">
        <Avatar size={80} src={userData.avatar} />
        <div>
          <Typography.Title level={4} className="mb-0">
            {userData.name}
          </Typography.Title>
          <Typography.Text type="secondary">{userData.email}</Typography.Text>
        </div>
      </div>

      <Form form={form} layout="vertical" disabled={!editing}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input placeholder="Your Name" />
          </Form.Item>

          <Form.Item name="age" label="Age" rules={[{ required: true }]}>
            <Input placeholder="Your Age" />
          </Form.Item>

          <Form.Item name="gender" label="Gender" rules={[{ required: true }]}>
            <Select placeholder="Your Gender">
              <Select.Option value="Female">Female</Select.Option>
              <Select.Option value="Male">Male</Select.Option>
              <Select.Option value="Other">Other</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="language" label="Language" rules={[{ required: true }]}>
            <Select placeholder="Your Preferred Language">
              <Select.Option value="English">English</Select.Option>
              <Select.Option value="German">German</Select.Option>
              <Select.Option value="French">French</Select.Option>
              <Select.Option value="Chinese">Chinese</Select.Option>
            </Select>
          </Form.Item>
        </div>

        <div className="flex justify-end gap-4 mt-4">
          {editing ? (
            <>
              <Button onClick={handleCancel}>Cancel</Button>
              <Button type="primary" onClick={handleEdit}>
                Save
              </Button>
            </>
          ) : (
            <Button type="primary" onClick={() => setEditing(true)}>
              Edit
            </Button>
          )}
        </div>
      </Form>

      <div className="mt-10">
        <Typography.Title level={5}>My email Address</Typography.Title>
        <div className="flex items-center gap-3 mt-2">
          <Avatar icon={<MailOutlined />} style={{ backgroundColor: "#dbeafe" }} />
          <div>
            <Typography.Text>{userData.email}</Typography.Text>
            <div className="text-sm text-gray-500">1 month ago</div>
          </div>
        </div>
        <Button
          danger
          onClick={handleLogout}
          style={{ marginTop: "1.5rem", borderRadius: "24px" }}
        >
          Logout
        </Button>
      </div>
    </ProfileMessNotiLayout>
  );
}
