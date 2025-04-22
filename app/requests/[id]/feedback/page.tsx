"use client"; // For components that need React hooks and browser APIs, SSR (server side rendering) has to be disabled. Read more here: https://nextjs.org/docs/pages/building-your-application/rendering/server-side-rendering

import "@ant-design/v5-patch-for-react-19";
import { useRouter } from "next/navigation"; // use NextJS router for navigation
import { useApi } from "@/hooks/useApi";
import { Button, Form, Input } from "antd";
import '@/styles/globals.css';
import LoggedIn from "@/components/LoggedIn";
import { Request } from "@/types/request";
import { useParams } from "next/navigation";
// Optionally, you can import a CSS module or file for additional styling:
// import styles from "@/styles/page.module.css";

const { TextArea } = Input;

const Feedback: React.FC = () => {
    const { id } = useParams();
    const router = useRouter();
    const apiService = useApi();
    const [form] = Form.useForm();


    const handleSubmit = async (values: Request) => {
        try {
            // Call the API service and let it handle JSON serialization and error handling
            await apiService.put<Request>(`/requests/${id}/feedback`, { feedback: values.feedback });

            // Navigate to the user overview
            router.push("/requests/my-requests");
        } catch (error) {
            if (error instanceof Error) {
                alert(`Something went wrong:\n${error.message}`);
            } else {
                console.error("An unknown error occurred during login.");
            }
            router.push("/requests/my-requests");
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
                        <h3 className="login-title">Feedback</h3>

                        <Form.Item
                            name="feedback"
                            label="Feedback"
                            rules={[{ message: "Please input your feedback!" }]}
                        >
                            <TextArea rows={5} placeholder="Please input your feedback!" />
                        </Form.Item>

                        <Form.Item>
                            <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
                                <Button type="primary" htmlType="submit">
                                    Submit
                                </Button>
                                <Button type="default" onClick={() => router.push("/requests/my-requests")}>
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

export default Feedback;
