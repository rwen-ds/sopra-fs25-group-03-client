"use client";

import React, { useEffect, useState } from "react";
import { Layout, Menu, Button } from "antd";
import { DashboardOutlined, TeamOutlined, FileTextOutlined, BellOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import Image from "next/image";
import { User } from "@/types/user";

const { Sider, Content, Header } = Layout;

export default function AdminDashboard() {
  const router = useRouter();
  const apiService = useApi();
  const [admin, setAdmin] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminInfo = async () => {
      try {
        const user = await apiService.get<User>("/users/me");
        setAdmin(user);
      } catch (error) {
        console.error("Failed to fetch admin info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminInfo();
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
          <div style={{ color: "#fff", marginTop: 12, fontWeight: 500 }}>
            {admin?.username || "AdminName"}
          </div>
        </div>
        <Menu
          mode="inline"
          defaultSelectedKeys={["dashboard"]}
          style={{ background: "#182153", color: "#fff", border: "none" }}
          onClick={({ key }) => handleMenuClick(key)}
        >
          <Menu.Item key="dashboard" icon={<DashboardOutlined style={{ color: "#fff" }} />} style={{ margin: "16px 0", background: "#4B7CC9", borderRadius: 6 }}>
            Dashboard
          </Menu.Item>
          <Menu.Item key="users" icon={<TeamOutlined style={{ color: "#fff" }} />} style={{ margin: "16px 0" }}>
            Users
          </Menu.Item>
          <Menu.Item key="request" icon={<FileTextOutlined style={{ color: "#fff" }} />} style={{ margin: "16px 0" }}>
            Requests
          </Menu.Item>
        </Menu>
      </Sider>

      {/* Main Content */}
      <Layout>
        <Header style={{ background: "#fcfbfb", padding: "0 2rem", display: "flex", justifyContent: "flex-end", alignItems: "center", height: 80 }}>
          <BellOutlined style={{ fontSize: 22, color: "#22426b", marginRight: 32 }} />
          <Button
            type="primary"
            style={{ background: "#5fa8e6", borderColor: "#5fa8e6", borderRadius: 6, fontWeight: 500, width: 100 }}
            onClick={handleLogout}
          >
            Log out
          </Button>
        </Header>

        <Content style={{ margin: "2rem", background: "#fff", padding: "2rem", borderRadius: 8 }}>
          {loading ? (
            <p style={{ color: "#888" }}>Loading...</p>
          ) : (
            <>
              <h1 style={{fontSize: "24px",fontWeight: "bold",marginBottom: "8px",color: "#182153", }}>
                Welcome to your dashboard{admin?.username ? `, ${admin.username}` : " AdminName"}
              </h1>
              <p style={{ color: "#182153" }}>{admin?.email || "admin@example.com"}</p>
            </>
          )}
        </Content>
      </Layout>
    </Layout>
  );
}
