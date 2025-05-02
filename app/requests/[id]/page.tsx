"use client";

import { useEffect, useState } from "react";
import { useApi } from "@/hooks/useApi";
import { Request } from "@/types/request";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Button, Spin } from "antd";
import LoggedIn from "@/components/LoggedIn";
import { useRouter } from "next/navigation";
import useLocalStorage from "@/hooks/useLocalStorage";

const RequestDetail: React.FC = () => {
  const { id } = useParams();
  const apiService = useApi();
  const [request, setRequest] = useState<Request | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { value: user } = useLocalStorage<{ id: number }>('user', { id: 0 });

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const data = await apiService.get<Request>(`/requests/${id}`);
        setRequest(data);
      } catch (error) {
        console.error("Error fetching request details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequest();
  }, [apiService, id, request?.emergencyLevel]);

  if (loading || !request) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <Spin size="large" />
      </div>
    );
  }

  const handleVolunteer = async () => {
    try {
      await apiService.put(`/requests/${id}/volunteer`, {});
      router.push("/requests");
    } catch (error) {
      console.error("Failed to volunteer:", error);
    }
  };

  return (
    <>
      <LoggedIn />
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "60px 20px",
        minHeight: "100vh"
      }}>
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "40px",
          maxWidth: "900px",
          width: "100%",
          backgroundColor: "#fff",
          padding: "40px",
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
        }}>
          {/* left */}
          <div style={{ flex: "1 1 300px", display: "flex", justifyContent: "center" }}>
            <Image
              src="/cat.jpg"
              alt="cat"
              width={300}
              height={300}
              style={{ objectFit: "contain", borderRadius: "12px" }}
            />
          </div>

          <div style={{ flex: "2 1 400px" }}>
            <h2 style={{
              fontSize: "28px",
              marginBottom: "24px",
              color: "#1E0E62"
            }}>{request.title}</h2>

            <div style={{ marginBottom: "16px" }}>
              <p style={{ margin: 0, color: "#1E0E62", fontWeight: 600 }}>Description:</p>
              <p style={{ color: "#555" }}>{request.description}</p>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <p style={{ margin: 0, color: "#1E0E62", fontWeight: 600 }}>Contact Info:</p>
              <p style={{ color: "#555" }}>{request.contactInfo || <span>&nbsp;</span>}</p>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <p style={{ margin: 0, color: "#1E0E62", fontWeight: 600 }}>Location:</p>
              <p style={{ color: "#555" }}>{request.location || <span>&nbsp;</span>}</p>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <p style={{ margin: 0, color: "#1E0E62", fontWeight: 600 }}>Emergency Level:</p>
              <p style={{ color: "#555" }}>{request.emergencyLevel || <span>&nbsp;</span>}</p>
            </div>

            {/* buttons */}
            <div style={{ display: "flex", gap: "20px", marginTop: "32px", justifyContent: "center" }}>
              {request.posterId !== user.id && (
                <Button
                  type="primary"
                  onClick={handleVolunteer}
                  style={{
                    borderRadius: "8px",
                    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                    padding: "6px 16px",
                    fontWeight: "bold",
                    fontSize: "14px",
                  }}
                >
                  Volunteer to Help
                </Button>
              )}
              <Button
                onClick={() => router.push("/requests")}
                style={{
                  borderRadius: "8px",
                  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                  padding: "6px 16px",
                  fontWeight: "bold",
                  fontSize: "14px",
                }}
              >
                Back to Market
              </Button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default RequestDetail;
