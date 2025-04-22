"use client"; // For components that need React hooks and browser APIs, SSR (server side rendering) has to be disabled.

import { useEffect, useState } from "react";
import { Button, Card, Row, Col } from "antd";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useApi } from "@/hooks/useApi"; // API 请求 hook
import { User } from "@/types/user";
import LoggedIn from "@/components/LoggedIn";
import SideBar from "@/components/SideBar"; // 侧边栏组件


const Profile: React.FC = () => {
  const apiService = useApi();
  const router = useRouter();
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 获取当前用户数据
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const user = await apiService.get<User>("/users/me");
        setUserData(user);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [apiService]);

  // 如果数据正在加载，显示加载状态
  if (loading) {
    return <div>Loading...</div>;
  }

  // 处理登出逻辑
  const handleLogout = () => {
    localStorage.removeItem("token"); // 删除 token
    localStorage.removeItem("user")
    apiService.put("/users/logout", {}); // 调用登出 API
    router.push("/"); // 跳转到登录页
  };

  // 处理编辑逻辑
  const handleEdit = () => {
    router.push("/profile/edit"); // 跳转到编辑页面
  };

  return (
    <>
      <LoggedIn />
      <div style={{ display: "flex", height: "calc(100vh - 80px)", overflow: "hidden" }}>
        <SideBar />
        <div style={{ flex: 1, padding: "40px", display: "flex", justifyContent: "center" }}>
          <Card
            style={{
              width: "100%",
              maxWidth: "700px", // 放大一点
              textAlign: "center",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              padding: "32px", // 更舒展
              backgroundColor: "#fff", // 白色背景
            }}
          >
            <Image
              src="/cat.png"
              alt="User Avatar"
              width={150}
              height={150}
              style={{ objectFit: "cover", borderRadius: "50%" }}
            />
            <h2 style={{ color: "#1E0E62", marginTop: "16px" }}>
              {userData ? userData.username : "Loading..."}
            </h2>
            <div style={{ marginTop: "24px", lineHeight: "2", fontSize: "16px", color: "#555", textAlign: "left" }}>
              <div>
                <strong>Email:</strong> {userData?.email || ""}
              </div>
              <div>
                <strong>Age:</strong> {userData?.age !== undefined && userData?.age !== null ? userData.age : ""}
              </div>
              <div>
                <strong>Language:</strong> {userData?.language || ""}
              </div>
              <div>
                <strong>Gender:</strong> {
                  userData?.gender === "MALE"
                    ? "Male"
                    : userData?.gender === "FEMALE"
                      ? "Female"
                      : userData?.gender === "OTHER"
                        ? "Other"
                        : ""
                }
              </div>
            </div>

            <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
              <Col span={12}>
                <Button block type="primary" onClick={handleEdit}>
                  Edit
                </Button>
              </Col>
              <Col span={12}>
                <Button block type="default" onClick={handleLogout}>
                  Logout
                </Button>
              </Col>
            </Row>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Profile;
