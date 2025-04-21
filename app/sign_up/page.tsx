"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Form, Input, Checkbox, Typography, message } from "antd";
import CatCardLayout from "@/components/CatCardLayout";
import { useApi } from "@/hooks/useApi";
import useLocalStorage from "@/hooks/useLocalStorage";

const { Title, Text, Link } = Typography;

interface SignupFormValues {
  email: string;
  password: string;
  terms: boolean;
}

export default function SignupPage() {
  const router = useRouter();
  const [form] = Form.useForm();
  const api = useApi();
  const { set: setToken } = useLocalStorage<string>("token", "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: SignupFormValues) => {
    if (!values.terms) {
      message.warning("Please agree to the terms first!");
      return;
    }

    setLoading(true);
    try {
      const { data, headers, status } = await api.postWithHeaders("/users", {
        email: values.email,
        password: values.password,
      });

      const token = headers.get("Authorization");

      if (status === 201 && token) {
        setToken(token);
        message.success("Account created successfully!");
        router.push("/loggedInHome"); 
      } else if (status === 409) {
        message.error("Email already exists. Please use another one.");
      } else {
        message.warning("Signup succeeded but response is unusual.");
      }
    } catch (error) {
      message.error("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CatCardLayout title="Sign Up Now">
      {/* HOME */}
      <Button
        type="default"
        onClick={() => router.push("/unlogged")}
        style={{
          position: "absolute",
          top: "1.5rem",
          left: "1.5rem",
          backgroundColor: "#60dbc5",
          color: "white",
          borderRadius: "24px",
        }}
      >
        HOME
      </Button>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ terms: true }}
        size="large"
        style={{ width: "100%" }}
      >
        <Form.Item
          name="email"
          rules={[{ required: true, type: "email", message: "Please enter a valid email" }]}
        >
          <Input placeholder="Your email" style={{ borderRadius: "24px", paddingLeft: "16px" }} />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please enter a password" }]}
        >
          <Input.Password
            placeholder="Your password"
            style={{ borderRadius: "24px", paddingLeft: "16px" }}
          />
        </Form.Item>

        <Form.Item name="terms" valuePropName="checked">
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
            Create an Account
          </Button>
        </Form.Item>
      </Form>

      <div style={{ textAlign: "center" }}>
        <Text>Do you have an Account? </Text>
        <Link onClick={() => router.push("/login")} style={{ color: "#60dbc5", fontWeight: 600 }}>
          Sign In
        </Link>
      </div>
    </CatCardLayout>
  );
}
