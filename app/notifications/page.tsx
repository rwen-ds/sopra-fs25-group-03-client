"use client";

import { useEffect, useState } from "react";
import { useApi } from "@/hooks/useApi";
import { useRouter } from "next/navigation";
import LoggedIn from "@/components/LoggedIn";
import SideBar from "@/components/SideBar";
import ErrorAlert from "@/components/ErrorAlert";

interface Notification {
  recipientId: number;
  relatedUserId: number;
  relatedUsername: string;
  requestId: number;
  requestTitle: string,
  type: string;
  isRead: boolean;
  timestamp: string;
}

const NotificationPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const apiService = useApi();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const getNotificationMessage = (n: Notification): string => {
    switch (n.type) {
      case "VOLUNTEERED":
        return `${n.relatedUsername} volunteered to help with your request "${n.requestTitle}".`;
      case "VOLUNTEERING":
        return `You volunteered to help with "${n.requestTitle}" posted by ${n.relatedUsername}.`;
      case "ACCEPTING":
        return `You accepted ${n.relatedUsername}'s help for your request "${n.requestTitle}".`;
      case "ACCEPTED":
        return `Your volunteer offer for "${n.requestTitle}" was accepted by ${n.relatedUsername}.`;
      case "COMPLETED":
        return `Your request "${n.requestTitle}" was completed by ${n.relatedUsername}.`;
      case "FEEDBACK":
        return `You received feedback for your help with "${n.requestTitle}".`;
      case "POSTERCALCEL":
        return `${n.relatedUsername} canceled your volunteer offer for "${n.requestTitle}".`;
      case "VOLUNTEERCALCEL":
        return `${n.relatedUsername} canceled the volunteer offer for "${n.requestTitle}".`;
      default:
        return "You have a new notification.";
    }
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await apiService.get<Notification[]>("/notifications");
        setNotifications(response);

        await apiService.put("/notifications/mark-read", {});
      } catch (error) {
        if (error instanceof Error) {
          setErrorMessage(`Error fetching data: ${error.message}`);
        } else {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchNotifications();

    // Set up an interval to fetch new notifications every 30 seconds (30000ms)
    const intervalId = setInterval(() => {
      fetchNotifications();
    }, 5000);

    // Cleanup the interval when the component is unmounted
    return () => clearInterval(intervalId);

  }, [apiService]);

  const handleAccept = async ({ requestId, relatedUserId }: Notification) => {
    try {
      await apiService.put(`/requests/${requestId}/accept?volunteerId=${relatedUserId}`, {});
      setSuccessMessage("Request accepted successfully!");
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(`Failed to accept: ${error.message}`);
      } else {
        console.error("Failed to accept:", error);
      }
    }
  };

  const handleComplete = async (requestId: number) => {
    try {
      await apiService.put(`/requests/${requestId}/complete`, {});
      setSuccessMessage("Request marked as completed.");
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(`Failed to complete: ${error.message}`);
      } else {
        console.error("Failed to complete:", error);
      }
    }
  };

  const handleCancelRequest = async (requestId: number) => {
    try {
      // Call the cancel request API
      await apiService.put(`/requests/${requestId}/cancel`, {})
      // Optionally show success or update the UI accordingly
      setSuccessMessage("Request has been canceled successfully!");
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(`Failed to cancel the request: ${error.message}`);
      } else {
        console.error("Failed to cancel:", error);
      }
    }
  };


  const handleGoToChatWithUser = (relatedUserId: number) => {
    router.push(`/chat/${relatedUserId}`);
  };

  return (
    <>
      <div className="flex flex-col h-screen">
        <LoggedIn />
        <div className="flex overflow-hidden">
          <SideBar />
          <div className="relative flex-1 p-8">
            <ErrorAlert
              message={errorMessage}
              onClose={() => setErrorMessage(null)}
              duration={5000}
              type="error"
            />
            <ErrorAlert
              message={successMessage}
              onClose={() => setSuccessMessage(null)}
              duration={5000}
              type="success"
            />
            <h2 className="text-2xl font-bold mb-8">Notifications</h2>

            <div className="space-y-6">
              {notifications.map((n, idx) => (
                <div key={idx} className="alert alert-vertical sm:alert-horizontal flex items-center">
                  <span className="text-base-content">{getNotificationMessage(n)}</span>
                  <div className="ml-auto flex flex-wrap gap-3">
                    {n.type === "VOLUNTEERED" && (
                      <>
                        <button className="btn btn-sm" onClick={() => router.push(`/users/${n.relatedUserId}`)}>View Profile</button>
                        <button className="btn btn-sm" onClick={() => handleGoToChatWithUser(n.relatedUserId)}>Chat</button>
                        <button className="btn btn-sm btn-primary" onClick={() => handleAccept(n)}>Accept</button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleCancelRequest(n.requestId)}>Cancel</button>
                      </>
                    )}
                    {n.type === "VOLUNTEERING" && (
                      <>
                        <button className="btn btn-sm" onClick={() => router.push(`/users/${n.relatedUserId}`)}>View Profile</button>
                        <button className="btn btn-sm" onClick={() => router.push(`/requests/${n.requestId}`)}>View Request</button>
                        <button className="btn btn-sm" onClick={() => handleGoToChatWithUser(n.relatedUserId)}>Chat</button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleCancelRequest(n.requestId)}>Cancel</button>
                      </>
                    )}
                    {n.type === "ACCEPTING" && (
                      <>
                        <button className="btn btn-sm" onClick={() => handleGoToChatWithUser(n.relatedUserId)}>Chat</button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleCancelRequest(n.requestId)}>Cancel</button>
                      </>
                    )}
                    {n.type === "ACCEPTED" && (
                      <>
                        <button className="btn btn-sm" onClick={() => handleGoToChatWithUser(n.relatedUserId)}>Chat</button>
                        <button className="btn btn-sm btn-primary" onClick={() => handleComplete(n.requestId)}>Completed</button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleCancelRequest(n.requestId)}>Cancel</button>
                      </>
                    )}
                    {n.type === "COMPLETED" && (
                      <button className="btn btn-sm btn-primary" onClick={() => router.push("/requests/my-requests")}>
                        Go to mark as done
                      </button>
                    )}
                    {n.type === "FEEDBACK" && (
                      <button className="btn btn-sm" onClick={() => router.push(`/requests/${n.requestId}`)}>View Request</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div >
    </>
  );
};

export default NotificationPage;
