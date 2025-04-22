"use client"; // For components that need React hooks and browser APIs, SSR (server side rendering) has to be disabled. Read more here: https://nextjs.org/docs/pages/building-your-application/rendering/server-side-rendering

import "@ant-design/v5-patch-for-react-19";
import { useRouter } from "next/navigation"; // use NextJS router for navigation
import { useApi } from "@/hooks/useApi";
import { User } from "@/types/user";
import { Button, Form, Input } from "antd";
import '@/styles/globals.css';
import Header from "@/components/Header";

// Optionally, you can import a CSS module or file for additional styling:
// import styles from "@/styles/page.module.css";

interface FormFieldProps {
  label: string;
  value: string;
}

const Login: React.FC = () => {
  const router = useRouter();
  const apiService = useApi();
  const [form] = Form.useForm();
  // useLocalStorage hook example use
  // The hook returns an object with the value and two functions
  // Simply choose what you need from the hook:
  const handleLogin = async (values: FormFieldProps) => {
    try {
      // Call the API service and let it handle JSON serialization and error handling
      const user = await apiService.post<User>("/users", values);
      // Store the user data in local storage
      localStorage.setItem("user", JSON.stringify(user));

      // Navigate to the user overview
      router.push("/logged-in");
    } catch (error) {
      if (error instanceof Error) {
        alert(`Something went wrong during the register:\n${error.message}`);
      } else {
        console.error("An unknown error occurred during login.");
      }
      router.push("/");
    }
  };

  return (
    <>
      <div className="background-layer" />
      <Header />
      <div className="login-container">
        <div className='form-container'>
          <Form
            form={form}
            name="login"
            size="large"
            variant="outlined"
            onFinish={handleLogin}
            layout="vertical"
          >
            <h3 className="register-title">Register</h3>
            <Form.Item
              name="username"
              label="Username"
              rules={[{ required: true, message: "Please input your username!" }]}
            >
              <Input placeholder="Enter username" />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, message: "Please input your email!" }]}
            >
              <Input placeholder="Enter email" />
            </Form.Item>
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: "Please input your name!" }]}
            >
              <Input placeholder="Enter password" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="register-button">
                Register
              </Button>
              <div>
                <Button type="link" onClick={() => router.push("/login")}>
                  Don&apos;t have an account? Login here
                </Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Login;
