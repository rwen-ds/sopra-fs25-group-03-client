"use client";

import { useEffect, useState } from "react";
import { Button, Form, Input, Select, Row, Col, Card } from "antd";
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import { User } from "@/types/user";
import LoggedIn from "@/components/LoggedIn";
import SideBar from "@/components/SideBar";
import Image from "next/image";

const { Option } = Select;

const EditProfile: React.FC = () => {
    const [form] = Form.useForm();
    const router = useRouter();
    const apiService = useApi();
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<number | null>(null);
    const [userData, setUserData] = useState<User | null>(null);


    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await apiService.get<User>("/users/me");
                form.setFieldsValue(data);
                setUserData(data);
                setUserId(data.id);
            } catch (error) {
                console.error("Failed to load user:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [apiService, form]);

    const handleSubmit = async (values: User) => {
        if (!userId || !userData) return;

        const updatedUser: User = {
            ...userData,     // 原始完整用户信息
            ...values,       // 表单中修改的部分
        };
        try {
            await apiService.put(`/users/${userId}`, updatedUser);
            router.push("/profile");
        } catch (error) {
            console.error("Failed to update user:", error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <LoggedIn />
            <div style={{ display: "flex", height: "calc(100vh - 80px)", overflow: "auto" }}>
                <SideBar />
                <div style={{ flex: 1, padding: "40px", display: "flex", justifyContent: "center" }}>
                    <Card
                        style={{
                            width: "100%",
                            maxWidth: "700px",
                            borderRadius: "12px",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                            padding: "32px",
                            backgroundColor: "#fff",
                            textAlign: "center",
                        }}
                    >
                        <Image
                            src="/cat.png"
                            alt="User Avatar"
                            width={150}
                            height={150}
                            style={{ objectFit: "cover", borderRadius: "50%" }}
                        />
                        <h2 style={{ color: "#1E0E62", marginTop: "16px" }}>Edit Profile</h2>

                        <Form
                            layout="vertical"
                            form={form}
                            onFinish={handleSubmit}
                            style={{ marginTop: "24px", textAlign: "left" }}
                        >
                            <Form.Item label="Username" name="username" className="custom-label custom-input">
                                <Input />
                            </Form.Item>
                            <Form.Item label="Email" name="email" className="custom-label custom-input">
                                <Input type="email" />
                            </Form.Item>
                            <Form.Item label="Age" name="age" className="custom-label custom-input">
                                <Input type="number" />
                            </Form.Item>
                            <Form.Item label="Language" name="language" className="custom-label custom-input">
                                <Input />
                            </Form.Item>
                            <Form.Item label="Gender" name="gender" className="custom-label custom-input">
                                <Select placeholder="Select gender">
                                    <Option value="MALE">Male</Option>
                                    <Option value="FEMALE">Female</Option>
                                    <Option value="OTHER">Other</Option>
                                </Select>
                            </Form.Item>

                            <Row gutter={[16, 16]} style={{ marginTop: "20px", textAlign: "center" }}>
                                <Col span={12}>
                                    <Button block type="primary" htmlType="submit">
                                        Save
                                    </Button>
                                </Col>
                                <Col span={12}>
                                    <Button block type="default" onClick={() => router.push("/profile")}>
                                        Cancel
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    </Card>
                </div>
            </div>
        </>
    );
};

export default EditProfile;
