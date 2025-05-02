"use client";

import { Card, Col, Row } from "antd";
import { useEffect, useState } from "react";
import { Request } from "@/types/request";
import { useApi } from "@/hooks/useApi";
import LoggedIn from "@/components/LoggedIn";
import Image from "next/image";
import Link from "next/link";

const RequestMarket: React.FC = () => {
  const apiService = useApi();
  const [requests, setRequests] = useState<Request[]>([]);

  useEffect(() => {
    const fetchRequests = async () => {
      const res = await apiService.get<Request[]>("/requests/active");
      setRequests(res);
    };
    fetchRequests();
  }, [apiService]);


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
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </>
  );
};

export default RequestMarket;
