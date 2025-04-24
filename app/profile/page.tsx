"use client"; // For components that need React hooks and browser APIs, SSR (server side rendering) has to be disabled.

import { useEffect, useState } from "react";
import { Button, Card, Row, Col } from "antd";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useApi } from "@/hooks/useApi";
import { User } from "@/types/user";
import LoggedIn from "@/components/LoggedIn";
import SideBar from "@/components/SideBar";


const Profile: React.FC = () => {
  const apiService = useApi();
  const router = useRouter();
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // get user data
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

  // loading
  if (loading) {
    return <div>Loading...</div>;
  }

  // logout
  const handleLogout = () => {
    apiService.put("/users/logout", {});
    localStorage.removeItem("token"); // delete token
    localStorage.removeItem("user")
    router.push("/");
  };

  // edit profile
  const handleEdit = () => {
    router.push("/profile/edit");
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
              maxWidth: "700px",
              textAlign: "center",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              padding: "32px",
              backgroundColor: "#fff",
            }}
          >
            <Image
              src="/cat.jpg"
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
