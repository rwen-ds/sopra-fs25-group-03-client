"use client";

import React, { useEffect, useState } from "react";
import { Layout, Menu, Button, Input, Table, Avatar, Dropdown } from "antd";
import { BellOutlined, UserOutlined, DashboardOutlined, TeamOutlined, FileTextOutlined } from "@ant-design/icons";
import { useApi } from "@/hooks/useApi";
import Image from "next/image";

const { Sider, Content, Header } = Layout;

const columns = [
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Description", dataIndex: "description", key: "description" },
    { title: "Contact Info", dataIndex: "contactInfo", key: "contactInfo" },
    { title: "Location", dataIndex: "location", key: "location" },
    { title: "Emergency Level", dataIndex: "emergencyLevel", key: "emergencyLevel" },
];

type Request = {
    id: string;
    title: string;
    description: string;
    contactInfo: string;
    location: string;
    emergencyLevel: string;
};

export default function AdminRequestsPage() {
    const apiService = useApi();
    const [data, setData] = useState<Array<{ key: string; title: string; description: string; contactInfo: string; location: string; emergencyLevel: string }>>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const headers: Record<string, string> = {
                    'Content-Type': 'application/json',
                };
                const token = localStorage.getItem('token');
                if (token) headers['Authorization'] = token;

                const response = await fetch('http://localhost:8080/requests', { headers });
                const res = await response.json();
                setData(res.map((r: Request) => ({
                    key: r.id,
                    title: r.title,
                    description: r.description,
                    contactInfo: r.contactInfo,
                    location: r.location,
                    emergencyLevel: r.emergencyLevel,
                })));
            } catch (err) {
                console.error("API error:", err);
                setData([]);
            } finally {
                setLoading(false);
            }
        };
        fetchRequests();
    }, [apiService]);

    return (
        <Layout style={{ minHeight: "100vh" }}>
            {/* Sidebar */}
            <Sider width={210} style={{ background: "#182153", padding: 0 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "2rem 0 1rem 0" }}>
                    <Image
                        src="/cat.jpg"
                        alt="Admin Avatar"
                        width={64}
                        height={64}
                        style={{ objectFit: "cover", borderRadius: "50%" }}
                    />
                    <div style={{ color: "#fff", marginTop: 12, fontWeight: 500 }}>AdminName</div>
                </div>
                <Menu
                    mode="inline"
                    defaultSelectedKeys={["request"]}
                    style={{ background: "#182153", color: "#fff", border: "none" }}
                >
                    <Menu.Item key="dashboard" icon={<DashboardOutlined style={{ color: "#fff" }} />}
                        style={{ margin: "16px 0" }}>
                        Dashboard
                    </Menu.Item>
                    <Menu.Item key="users" icon={<TeamOutlined style={{ color: "#fff" }} />}
                        style={{ margin: "16px 0" }}>
                        Users
                    </Menu.Item>
                    <Menu.Item key="request" icon={<FileTextOutlined style={{ color: "#fff" }} />}
                        style={{ margin: "16px 0", background: "#4B7CC9", borderRadius: 6, color: "#fff" }}>
                        Request
                    </Menu.Item>
                </Menu>
            </Sider>

            {/* Main Content */}
            <Layout>
                {/* Top Bar */}
                <Header style={{ background: "#fcfbfb", padding: "0 2rem", display: "flex", alignItems: "center", height: 80, borderBottom: "none" }}>
                    <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
                        <Dropdown menu={{ items: [{ key: '1', label: 'Add filter' }] }} placement="bottomLeft">
                            <Button type="text" style={{ color: "#888", marginRight: 16, fontWeight: 400 }}>Add filter</Button>
                        </Dropdown>
                        <Input
                            prefix={<span style={{ color: '#bbb', marginRight: 8 }} className="anticon anticon-search" />}
                            placeholder="Search for a request by name or keyword"
                            style={{
                                width: 350,
                                background: "#fff",
                                borderRadius: 8,
                                color: "#222",
                                fontWeight: 400
                            }}
                        />
                    </div>
                    <BellOutlined style={{ fontSize: 22, color: "#22426b", marginRight: 32 }} />
                    <Button type="primary" style={{ background: "#5fa8e6", borderColor: "#5fa8e6", borderRadius: 6, fontWeight: 500, width: 100 }}>
                        Log out
                    </Button>
                </Header>

                {/* Table Content */}
                <Content style={{ margin: "2rem 2rem 0 2rem", background: "transparent" }}>
                    <Table
                        columns={columns}
                        dataSource={data}
                        loading={loading}
                        pagination={false}
                        bordered={false}
                        style={{
                            background: "white",
                            color: "#222",
                            fontWeight: 400,
                            borderRadius: 0,
                        }}
                    />
                </Content>
            </Layout>
        </Layout>
    );
}
