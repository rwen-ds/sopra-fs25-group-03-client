"use client";

import { useEffect, useState } from "react";
import { Card, Typography, Space, Button } from "antd";
import { useApi } from "@/hooks/useApi";
import { useRouter } from "next/navigation";
import LoggedIn from "@/components/LoggedIn";
import SideBar from "@/components/SideBar";

interface Notification {
  type: string;
  content: string;
  requestId: number;
  posterId: number;
  volunteerId: number;
  requestTitle: string;
}

const NotificationPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const apiService = useApi();
  const router = useRouter();
  const { Text, Title } = Typography;

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await apiService.get<Notification[]>("/requests/notifications");
        setNotifications(response);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchNotifications();
  }, [apiService]);

  const handleAccept = async ({ requestId, volunteerId }: Notification) => {
    try {
      await apiService.put(`/requests/${requestId}/accept?volunteerId=${volunteerId}`, {});
      router.push("/requests/my-requests");
    } catch (error) {
      console.error("Failed to accept:", error);
    }
  };

  const handleComplete = async (requestId: number) => {
    try {
      await apiService.put(`/requests/${requestId}/complete`, {});
      router.push("/requests/my-requests");
    } catch (error) {
      console.error("Failed to accept:", error);
    }
  };

  const handleGoToChatVolunteer = (volunteerId: number) => {
    router.push(`/chat/${volunteerId}`);
  };
  const handleGoToChatPoster = (posterId: number) => {
    router.push(`/chat/${posterId}`);
  };

  return (
    <>
      <LoggedIn />
      <div style={{ display: "flex", height: "calc(100vh - 80px)", overflow: "auto", backgroundColor: "#f5f7fa" }}>
        <SideBar />
        <div style={{ padding: "2rem", flex: 1 }}>
          <Title level={2} style={{ marginBottom: "2rem", color: "#1E0E62" }}>Notifications</Title>

          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            {notifications.map((n, idx) => (
              <Card
                key={idx}
                style={{
                  borderRadius: "12px",
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
                  backgroundColor: "#ffffff",
                }}
              >
                <Text style={{ fontSize: "16px", color: "#333" }}>{n.content}</Text>

                <div style={{ marginTop: "16px", display: "flex", gap: "12px" }}>
                  {n.type === "VOLUNTEERED" && (
                    <>
                      <Button onClick={() => handleGoToChatVolunteer(n.volunteerId)}>Chat</Button>
                      <Button type="primary" onClick={() => handleAccept(n)}>
                        Accept
                      </Button>
                    </>
                  )}

                  {n.type === "ACCEPTING" && (
                    <>
                      <Button onClick={() => handleGoToChatPoster(n.posterId)}>Chat</Button>
                      <Button type="primary" onClick={() => handleComplete(n.requestId)}>
                        Completed
                      </Button>
                    </>
                  )}

                  {n.type === "COMPLETED" && (
                    <Button type="primary" onClick={() => router.push('/requests/my-requests')}>
                      Go to mark as done
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </Space>
        </div>
      </div>
    </>
  );

};

export default NotificationPage;
