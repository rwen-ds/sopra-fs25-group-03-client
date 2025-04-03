"use client";

import { useRouter } from "next/navigation";
import { Button, Form, Input, Checkbox, Typography } from "antd";
import { useApi } from "@/hooks/useApi";
import { SignUpResponse } from "@/types/api";
import AuthLayout from "@/components/Authlayout"; 
import { useState } from "react";

const { Text, Link } = Typography;

interface SignUpFormValues {
  email: string;
  password: string;
  terms: boolean;
}

const SignUpPage: React.FC = () => {
  const router = useRouter();
  const apiService = useApi();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (values: SignUpFormValues) => {
    const { email, password } = values;

    try {
      setLoading(true);

      const response = await apiService.post<SignUpResponse>("/users/signup", {
        email,
        password,
      });

      if (response?.success || response?.message === "Signed up!") {
        alert("Account created successfully! Redirecting to login...");
        router.push("/login");
      } else {
        alert(response?.message || "Sign up failed. Please try again.");
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(`Sign up error:\n${error.message}`);
      } else {
        console.error("Unknown signup error", error);
        alert("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Button
        type="default"
        onClick={() => router.push("/")}
        style={{
          marginBottom: "1rem",
          backgroundColor: "#60dbc5",
          color: "white",
          borderRadius: "24px",
        }}
      >
        HOME
      </Button>

      <Form
        form={form}
        name="signup-form"
        layout="vertical"
        size="large"
        onFinish={handleSignUp}
        initialValues={{ terms: true }}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, type: "email", message: "Please enter a valid email!" }]}
        >
          <Input placeholder="Your email" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please enter your password!" }]}
        >
          <Input.Password placeholder="Your password" />
        </Form.Item>

        <Form.Item
          name="terms"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value ? Promise.resolve() : Promise.reject("You must agree to the terms."),
            },
          ]}
        >
          <Checkbox>I agree to the Terms of Service.</Checkbox>
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
            }}
          >
            Create an Account
          </Button>
        </Form.Item>
      </Form>

      <div style={{ textAlign: "center", marginTop: 16 }}>
        <Text>Do you have an Account? </Text>
        <Link onClick={() => router.push("/login")}>Sign In</Link>
      </div>
    </AuthLayout>
  );
};

export default SignUpPage;
