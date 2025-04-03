"use client";

import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import useLocalStorage from "@/hooks/useLocalStorage";
import { User } from "@/types/user";
import { Button, Form, Input, Checkbox, Typography } from "antd";
import AuthLayout from "@/components/Authlayout"; // background image here

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

  const handleLogin = async (values: LoginFormValues) => {
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
      if (error instanceof Error) {
        alert(`Something went wrong during login:\n${error.message}`);
      } else {
        console.error("Unknown error occurred during login.");
      }
    }
  };

  return (
    <AuthLayout>
      <Button
        type="default"
        onClick={() => router.push("/")}
        style={{ marginBottom: "1rem", backgroundColor: "#60dbc5", color: "white", borderRadius: "24px" }}
      >
        HOME
      </Button>

      <Form
        form={form}
        name="login-form"
        layout="vertical"
        size="large"
        onFinish={handleLogin}
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
                value ? Promise.resolve() : Promise.reject("You must agree to the terms"),
            },
          ]}
        >
          <Checkbox>I agree to the Terms of Service.</Checkbox>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{ width: "100%", borderRadius: "24px", backgroundColor: "#60dbc5", border: "none" }}
          >
            Sign In
          </Button>
        </Form.Item>
      </Form>

      <div style={{ textAlign: "center" }}>
        <Text>Don't have an account? </Text>
        <Link onClick={() => router.push("/signup")}>Sign Up</Link>
      </div>
    </AuthLayout>
  );
};

export default Login;
