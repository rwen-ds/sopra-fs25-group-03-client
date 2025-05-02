"use client";

import React, { useEffect, useState } from "react";
import { Layout, Menu, Button, Input, Table, Avatar, Dropdown } from "antd";
import { BellOutlined, UserOutlined, DashboardOutlined, TeamOutlined, FileTextOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import Image from "next/image";

const { Sider, Content, Header } = Layout;

const columns = [
    { title: "Username", dataIndex: "username", key: "username" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Age", dataIndex: "age", key: "age" },
    { title: "Language", dataIndex: "language", key: "language" },
    { title: "Gender", dataIndex: "gender", key: "gender" },
];

type User = {
    id: string;
    username: string;
    email: string;
    age?: number;
    language?: string;
    gender?: "MALE" | "FEMALE" | "OTHER";
};

export default function AdminUsersPage() {
    const apiService = useApi();
    const router = useRouter();
    const [data, setData] = useState<Array<any>>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
          try {
            const users = await apiService.get<User[]>("/users");
      
            const mappedData = users.map((user) => ({
              key: user.id,
              username: user.username || "-",
              email: user.email || "-",
              age: user.age ?? "-",
              language: user.language || "-",
              gender: user.gender === "MALE" ? "Male" :
                      user.gender === "FEMALE" ? "Female" :
                      user.gender === "OTHER" ? "Other" : "-"
            }));
      
            setData(mappedData);
          } catch (err) {
            console.error("API error:", err);
            setData([]);
          } finally {
            setLoading(false);
          }
        };
      
        fetchUsers();
      }, [apiService]);
      

    const handleLogout = () => {
        apiService.put("/users/logout", {});
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/");
    };

    const handleMenuClick = (key: string) => {
        if (key === "dashboard") router.push("/admin");
        if (key === "users") router.push("/admin/users");
        if (key === "request") router.push("/admin/requests");
    };

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
                    defaultSelectedKeys={["users"]}
                    style={{ background: "#182153", color: "#fff", border: "none" }}
                    onClick={({ key }) => handleMenuClick(key)}
                >
                    <Menu.Item key="dashboard" icon={<DashboardOutlined style={{ color: "#fff" }} />} style={{ margin: "16px 0" }}>
                        Dashboard
                    </Menu.Item>
                    <Menu.Item key="users" icon={<TeamOutlined style={{ color: "#fff" }} />} style={{ margin: "16px 0", background: "#4B7CC9", borderRadius: 6 }}>
                        Users
                    </Menu.Item>
                    <Menu.Item key="request" icon={<FileTextOutlined style={{ color: "#fff" }} />} style={{ margin: "16px 0" }}>
                        Request
                    </Menu.Item>
                </Menu>
            </Sider>

            {/* Main Content */}
            <Layout>
                {/* Top Bar */}
                <Header style={{ background: "#fcfbfb", padding: "0 2rem", display: "flex", alignItems: "center", height: 80 }}>
                    <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
                        <Dropdown menu={{ items: [{ key: '1', label: 'Add filter' }] }} placement="bottomLeft">
                            <Button type="text" style={{ color: "#888", marginRight: 16 }}>Add filter</Button>
                        </Dropdown>
                        <Input
                            placeholder="Search for a user by name or keyword"
                            style={{
                                width: 350,
                                background: "#fff",
                                borderRadius: 8,
                                color: "#222"
                            }}
                        />
                    </div>
                    <BellOutlined style={{ fontSize: 22, color: "#22426b", marginRight: 32 }} />
                    <Button
                        type="primary"
                        style={{ background: "#5fa8e6", borderColor: "#5fa8e6", borderRadius: 6, fontWeight: 500, width: 100 }}
                        onClick={handleLogout}
                    >
                        Log out
                    </Button>
                </Header>

                {/* Table */}
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
