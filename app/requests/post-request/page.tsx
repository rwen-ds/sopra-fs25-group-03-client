"use client"; // For components that need React hooks and browser APIs, SSR (server side rendering) has to be disabled. Read more here: https://nextjs.org/docs/pages/building-your-application/rendering/server-side-rendering

import "@ant-design/v5-patch-for-react-19";
import { useRouter } from "next/navigation"; // use NextJS router for navigation
import { useApi } from "@/hooks/useApi";
import { Button, Form, Input, Select } from "antd";
import '@/styles/globals.css';
import LoggedIn from "@/components/LoggedIn";
import { Request } from "@/types/request";
// import { useUser } from "@/hooks/useUser";
import useLocalStorage from "@/hooks/useLocalStorage";
import { User } from "@/types/user";
// Optionally, you can import a CSS module or file for additional styling:
// import styles from "@/styles/page.module.css";

const { TextArea } = Input;

const PostRuquest: React.FC = () => {
  const router = useRouter();
  const apiService = useApi();
  const [form] = Form.useForm();
  const { value: user } = useLocalStorage<User | null>("user", null);
  // const user = useUser();
  const userId = user?.id;
  // useLocalStorage hook example use
  // The hook returns an object with the value and two functions
  // Simply choose what you need from the hook:
  const handleSubmit = async (values: Request) => {
    try {
      // Call the API service and let it handle JSON serialization and error handling
      await apiService.post<Request>(`/requests?posterId=${userId}`, values);

      // Navigate to the user overview
      router.push("/requests/my-requests");
    } catch (error) {
      if (error instanceof Error) {
        alert(`Something went wrong during the login:\n${error.message}`);
      } else {
        console.error("An unknown error occurred during login.");
      }
      router.push("/");
    }
  };

  return (
    <>
      <div className="background-sea-layer" />
      <LoggedIn />
      <div className="request-container">
        <div className='request-form-container'>
          <Form
            form={form}
            name="post-request"
            layout="vertical"
            size="large"
            onFinish={handleSubmit}
          >
            <h3 className="login-title">Post a New Request</h3>

            <Form.Item
              name="title"
              label="Title"
              rules={[{ required: true, message: "Please enter the request title!" }]}
            >
              <Input placeholder="Short title for your request" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true, message: "Please describe your request!" }]}
            >
              <TextArea rows={5} placeholder="Describe the request in detail" />
            </Form.Item>

            <Form.Item
              name="contactInfo"
              label="Contact Information"
              rules={[{ message: "Please provide your contact info!" }]}
            >
              <Input placeholder="Email / Phone etc." />
            </Form.Item>

            <Form.Item
              name="location"
              label="Location"
              rules={[{ message: "Please enter the location!" }]}
            >
              <Input placeholder="e.g. Zurich City Center" />
            </Form.Item>

            <Form.Item
              name="emergencyLevel"
              label="Emergency Level"
              rules={[{ required: true, message: "Please select the emergency level!" }]}
            >
              <Select placeholder="Select an emergency level">
                <Select.Option value={0}>HIGH</Select.Option>
                <Select.Option value={1}>MEDIUM</Select.Option>
                <Select.Option value={2}>LOW</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
                <Button type="default" onClick={() => router.push("/requests")}>
                  Cancel
                </Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
};

export default PostRuquest;
