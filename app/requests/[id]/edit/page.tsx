"use client";

import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import { Button, Form, Input, Select, Modal } from "antd";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import LoggedIn from "@/components/LoggedIn";
import { Request } from "@/types/request";

const { TextArea } = Input;

const EditRequest: React.FC = () => {
    const { id } = useParams();
    const router = useRouter();
    const apiService = useApi();
    const [form] = Form.useForm();
    const [requestData, setRequestData] = useState<Request | null>(null);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchRequestData = async () => {
            try {
                const data = await apiService.get<Request>(`/requests/${id}`);
                setRequestData(data);
                form.setFieldsValue(data);
            } catch (error) {
                console.error("Error fetching request data:", error);
            }
        };
        if (id) {
            fetchRequestData();
        }
    }, [apiService, id, form]);

    const handleSubmit = async (values: Request) => {
        try {
            await apiService.put<Request>(`/requests/${id}`, values);
            router.push("/requests/my-requests");
        } catch (error) {
            if (error instanceof Error) {
                alert(`Something went wrong:\n${error.message}`);
            } else {
                console.error("An unknown error occurred during login.");
            }
            router.push("/");
        }
    };

    const handleDelete = async () => {
        setLoading(true); // loading
        try {
            await apiService.delete(`/requests/${id}`);
            setDeleteModalOpen(false);
            router.push("/requests/my-requests");
        } catch (error) {
            console.error("Error deleting request:", error);
            setDeleteModalOpen(false);
        } finally {
            setLoading(false);
        }
    };

    if (!requestData) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div className="background-sea-layer" />
            <LoggedIn />
            <div className="request-container">
                <div className="request-form-container">
                    <Form
                        form={form}
                        name="post-request"
                        layout="vertical"
                        size="large"
                        onFinish={handleSubmit}
                    >
                        <h3 className="login-title">Edit Request</h3>

                        <Form.Item
                            name="title"
                            label="Title"
                            rules={[{ message: "Please enter the request title!" }]}
                        >
                            <Input placeholder="Short title for your request" />
                        </Form.Item>

                        <Form.Item
                            name="description"
                            label="Description"
                            rules={[{ message: "Please describe your request!" }]}
                        >
                            <TextArea rows={5} placeholder="Describe the request in detail" />
                        </Form.Item>

                        <Form.Item
                            name="contactInfo"
                            label="Contact Information"
                            rules={[{ message: "Please provide your contact info!" }]}
                        >
                            <Input placeholder="Email / Phone / WeChat etc." />
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
                            rules={[{ message: "Please select the emergency level!" }]}
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

                                {/* Delete button */}
                                <Button
                                    type="default"
                                    danger
                                    onClick={() => setDeleteModalOpen(true)}
                                >
                                    Delete
                                </Button>
                            </div>
                        </Form.Item>
                    </Form>
                </div>
            </div>

            {/* delete confirmation */}
            <Modal
                title="Are you sure?"
                open={isDeleteModalOpen}
                onOk={handleDelete}
                onCancel={() => setDeleteModalOpen(false)}
                confirmLoading={loading}
                okText="Confirm"
                cancelText="Cancel"
                style={{ color: "black" }}
            >
                <p>This action is permanent and cannot be undone.</p>
            </Modal>
        </>
    );
};

export default EditRequest;
