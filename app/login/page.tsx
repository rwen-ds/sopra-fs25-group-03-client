"use client";

import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import useLocalStorage from "@/hooks/useLocalStorage";
import { User } from "@/types/user";
import { Button, Form, Input, Checkbox, Typography } from "antd";
import CatCardLayout from "@/components/CatCardLayout"; 
import { useState } from "react";

const { Text, Link } = Typography;

interface LoginFormValues {
  email: string;
  password: string;
  terms: boolean;
}

const Login: React.FC = () => {
  const router = useRouter();
  const apiService = useApi();
  const [form] = Form.useForm();
  const { set: setToken } = useLocalStorage<string>("token", "");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values: LoginFormValues) => {
    setLoading(true);
    try {
      const { email, password } = values;
      const response = await apiService.post<User>("/users/login", {
        email,
        password,
      });

      if (response.token) {
        setToken(response.token);
        router.push("/users");
      }
    } catch (error) {
      alert(`Login failed:\n${(error as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CatCardLayout title="Sign In" showHomeButton>
      <Form
        form={form}
        name="login-form"
        layout="vertical"
        size="large"
        onFinish={handleLogin}
        initialValues={{ terms: true }}
        style={{ width: "100%" }}
      >
        <Form.Item
          name="email"
          rules={[{ required: true, type: "email", message: "Please enter a valid email!" }]}
        >
          <Input
            placeholder="Your email"
            style={{ borderRadius: "24px", paddingLeft: "16px" }}
          />
        </Form.Item>
  
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please enter your password!" }]}
        >
          <Input.Password
            placeholder="Your password"
            style={{ borderRadius: "24px", paddingLeft: "16px" }}
          />
        </Form.Item>
  
        <Form.Item
          name="terms"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value ? Promise.resolve() : Promise.reject("You must agree to the terms"),
            },
          ]}
        >
          <Checkbox>
            I agree to the <a href="#">Terms of Service.</a>
          </Checkbox>
        </Form.Item>
  
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            style={{
              width: "100%",
              borderRadius: "24px",
              backgroundColor: "#60dbc5",
              border: "none",
              fontWeight: 600,
            }}
          >
            Sign In
          </Button>
        </Form.Item>
      </Form>
  
      <div style={{ textAlign: "center" }}>
        <Text>Don't have an account? </Text>
        <Link onClick={() => router.push("/sign_up")} style={{ color: "#60dbc5", fontWeight: 600 }}>
          Sign Up
        </Link>
      </div>
    </CatCardLayout>
  );  
};

export default Login;
