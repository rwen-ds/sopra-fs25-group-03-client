"use client";

import { Card, Col, Row, Button } from "antd";
import { EditOutlined, CheckOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Request } from "@/types/request";
import { useApi } from "@/hooks/useApi";
// import { useUser } from "@/hooks/useUser";
import LoggedIn from "@/components/LoggedIn";
import Image from "next/image";
import Link from "next/link";
import { User } from "@/types/user";
import useLocalStorage from "@/hooks/useLocalStorage";

const MyRequest: React.FC = () => {
  const apiService = useApi();
  const [requests, setRequests] = useState<Request[]>([]);
  const { value: user } = useLocalStorage<User | null>("user", null);
  const userId = user?.id;
  const router = useRouter();

  useEffect(() => {
    const fetchRequests = async () => {
      const res = await apiService.get<Request[]>(`/requests/my/${userId}`);
      setRequests(res);
    };
    fetchRequests();
  }, [apiService, userId]);


  const handleDone = async (requestId: number | null) => {
    try {
      await apiService.put(`/requests/${requestId}/done`, {});
      router.push(`/requests/${requestId}/feedback`);
    } catch (error) {
      console.error("Failed to mark as done:", error);
    }
  };

  return (
    <>
      <LoggedIn />
      <h1 style={{ textAlign: "center", marginTop: "20px" }}>My Requests</h1>
      <div style={{ padding: "40px" }}>
        <Row gutter={[24, 24]}>
          {requests.map((req) => (
            <Col xs={24} sm={12} md={8} lg={6} key={req.id}>
              <Card
                style={{
                  maxWidth: "300px",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  overflow: "hidden",
                  backgroundColor: "#ffffff",
                  textAlign: "center"
                }}
              >
                <Link href={`/requests/${req.id}`}>
                  <Image
                    src="/cat.png"
                    alt="cat"
                    width={200}
                    height={200}
                    style={{
                      objectFit: "cover",
                      width: "200px",
                      height: "200px",

                    }}
                  />
                </Link>
                <p style={{ color: "#000", fontWeight: "bold", margin: "12px 0" }}><strong>{req.title}</strong> </p>
                <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between" }}>
                  <Button icon={<EditOutlined />} type="default" onClick={() => router.push(`/requests/${req.id}/edit`)}>
                    Edit
                  </Button>
                  <Button icon={<CheckOutlined />} type="primary" onClick={() => handleDone(req.id)}>
                    Done
                  </Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </>
  );
};

export default MyRequest;
