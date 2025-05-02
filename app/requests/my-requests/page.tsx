"use client";

import { Card, Col, Row, Button } from "antd";
// import { EditOutlined, CheckOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Request } from "@/types/request";
import { useApi } from "@/hooks/useApi";
// import { useUser } from "@/hooks/useUser";
import LoggedIn from "@/components/LoggedIn";
import Image from "next/image";
import Link from "next/link";
// import { User } from "@/types/user";
// import useLocalStorage from "@/hooks/useLocalStorage";

const MyRequest: React.FC = () => {
  const apiService = useApi();
  const [requests, setRequests] = useState<Request[]>([]);
  // const { value: user } = useLocalStorage<User | null>("user", null);
  // const userId = user?.id;
  const router = useRouter();

  useEffect(() => {
    const fetchRequests = async () => {
      const res = await apiService.get<Request[]>("/requests/me");
      setRequests(res);
    };
    fetchRequests();
  }, [apiService]);


  const handleDone = async (requestId: number | null) => {
    try {
      await apiService.put(`/requests/${requestId}/done`, {});
      router.push(`/requests/${requestId}/feedback`);
    } catch (error) {
      if (error instanceof Error) {
        alert(`Failed to mark as done:\n${error.message}`);
      }
      console.error("Failed to mark as done:", error);
    }
  };

  return (
    <>
      <LoggedIn />
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
                    src="/cat.jpg"
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
                <div
                  style={{
                    marginTop: 16,
                    display: "flex",
                    justifyContent: req.status === "COMPLETED" ? "space-between" : "center",
                    alignItems: "center",
                  }}
                >
                  <Button
                    type="default"
                    onClick={() => router.push(`/requests/${req.id}/edit`)}
                    style={{
                      borderRadius: "8px",
                      boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                      padding: "6px 16px",
                    }}
                  >
                    Edit
                  </Button>

                  {req.status === "COMPLETED" && (
                    <Button
                      type="primary"
                      onClick={() => handleDone(req.id)}
                      style={{
                        marginLeft: "12px",
                        borderRadius: "8px",
                        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                        padding: "6px 16px",
                      }}
                    >
                      Done
                    </Button>
                  )}
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
