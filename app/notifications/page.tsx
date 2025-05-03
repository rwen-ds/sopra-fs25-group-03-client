"use client";

import { useEffect, useState } from "react";
import { useApi } from "@/hooks/useApi";
import { useRouter } from "next/navigation";
import LoggedIn from "@/components/LoggedIn";
import SideBar from "@/components/SideBar";

interface Notification {
  recipientId: number;
  relatedUserId: number;
  requestId: number;
  content: string;
  type: string;
  isRead: boolean;
  timestamp: string;
}

const NotificationPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const apiService = useApi();
  const router = useRouter();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await apiService.get<Notification[]>("/notifications");
        setNotifications(response);

        await apiService.put("/notifications/mark-read", {});
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchNotifications();
  }, [apiService]);

  const handleAccept = async ({ requestId, relatedUserId }: Notification) => {
    try {
      await apiService.put(`/requests/${requestId}/accept?volunteerId=${relatedUserId}`, {});
      window.location.reload();
    } catch (error) {
      console.error("Failed to accept:", error);
    }
  };

  const handleComplete = async (requestId: number) => {
    try {
      await apiService.put(`/requests/${requestId}/complete`, {});
      window.location.reload();
    } catch (error) {
      console.error("Failed to complete:", error);
    }
  };

  const handleGoToChatVolunteer = (relatedUserId: number) => {
    router.push(`/chat/${relatedUserId}`);
  };

  const handleGoToChatPoster = (relatedUserId: number) => {
    router.push(`/chat/${relatedUserId}`);
  };

  return (
    <>
      <div className="flex flex-col h-screen">
        <LoggedIn />
        <div className="flex overflow-hidden bg-base-200">
          <SideBar />
          <div className="flex-1 p-8">
            <h2 className="text-3xl font-bold text-primary mb-8">Notifications</h2>

            <div className="space-y-6">
              {notifications.map((n, idx) => (
                <div
                  key={idx}
                  className="card bg-base-100 shadow-lg rounded-xl p-6"
                >
                  <p className="text-lg text-base-content">{n.content}</p>
                  <div className="mt-4 flex gap-4">
                    {n.type === "VOLUNTEERED" && (
                      <>
                        <button
                          className="btn"
                          onClick={() => handleGoToChatVolunteer(n.relatedUserId)}
                        >
                          Chat
                        </button>
                        <button
                          className="btn btn-primary"
                          onClick={() => handleAccept(n)}
                        >
                          Accept
                        </button>
                      </>
                    )}

                    {n.type === "VOLUNTEERING" && (
                      <>
                        <button
                          className="btn"
                          onClick={() => handleGoToChatVolunteer(n.relatedUserId)}
                        >
                          Chat
                        </button>
                      </>
                    )}

                    {n.type === "ACCEPTING" && (
                      <>
                        <button
                          className="btn"
                          onClick={() => handleGoToChatPoster(n.relatedUserId)}
                        >
                          Chat
                        </button>
                      </>
                    )}

                    {n.type === "ACCEPTED" && (
                      <>
                        <button
                          className="btn"
                          onClick={() => handleGoToChatPoster(n.relatedUserId)}
                        >
                          Chat
                        </button>
                        <button
                          className="btn btn-primary"
                          onClick={() => handleComplete(n.requestId)}
                        >
                          Completed
                        </button>
                      </>
                    )}

                    {n.type === "COMPLETED" && (
                      <button
                        className="btn btn-primary"
                        onClick={() => router.push('/requests/my-requests')}
                      >
                        Go to mark as done
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationPage;
