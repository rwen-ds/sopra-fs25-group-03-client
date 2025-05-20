"use client";

import { useEffect, useState } from "react";
import { useApi } from "@/hooks/useApi";
import { useRouter } from "next/navigation";
import SideBar from "@/components/SideBar";
import ErrorAlert from "@/components/ErrorAlert";
import useAuthRedirect from "@/hooks/useAuthRedirect";
import useLocalStorage from "@/hooks/useLocalStorage";

interface Notification {
  notificationId: number;
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
  const { value: token } = useLocalStorage<string | null>('token', null);
  const { isLoading } = useAuthRedirect(token)
  const [loading, setLoading] = useState(true);


  const truncate = (str: string, maxLength: number) => {
    return str.length > maxLength ? str.slice(0, maxLength) + "..." : str;
  };

  const getNotificationMessage = (n: Notification): string => {
    const shortTitle = truncate(n.requestTitle, 40);
    switch (n.type) {
      case "VOLUNTEERED":
        return `${n.relatedUsername} volunteered to help with your request "${shortTitle}".`;
      case "VOLUNTEERING":
        return `You volunteered to help with "${shortTitle}" posted by ${n.relatedUsername}.`;
      case "ACCEPTING":
        return `You accepted ${n.relatedUsername}'s help for your request "${shortTitle}".`;
      case "ACCEPTED":
        return `Your volunteer offer for "${shortTitle}" was accepted by ${n.relatedUsername}.`;
      case "COMPLETED":
        return `Your request "${shortTitle}" was completed by ${n.relatedUsername}.`;
      case "FEEDBACK":
        return `You received feedback for your help with "${shortTitle}".`;
      case "POSTERCANCEL":
        return `${n.relatedUsername} canceled your volunteer offer for "${shortTitle}".`;
      case "VOLUNTEERCANCEL":
        return `${n.relatedUsername} canceled the volunteer offer for "${shortTitle}".`;
      default:
        return "You have a new notification.";
    }
  };

  useEffect(() => {
    if (isLoading) return;
    const fetchNotifications = async () => {
      try {
        const response = await apiService.get<Notification[]>("/notifications");
        setNotifications(response);

        // await apiService.put("/notifications/mark-read", {});
      } catch (error) {
        if (error instanceof Error) {
          setErrorMessage(`Error fetching data: ${error.message}`);
        } else {
          console.error("Error fetching data:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();

    // Set up an interval to fetch new notifications every 30 seconds (30000ms)
    const intervalId = setInterval(() => {
      fetchNotifications();
    }, 5000);

    // Cleanup the interval when the component is unmounted
    return () => clearInterval(intervalId);

  }, [apiService, isLoading]);

  const markNotificationAsRead = async (notificationId: number) => {
    try {
      await apiService.put(`/notifications/${notificationId}/mark-read`, {});
      setNotifications((prevNotifications) =>
        prevNotifications.map((n) =>
          n.notificationId === notificationId ? { ...n, isRead: true } : n
        )
      );
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-dots loading-xs"></span>
      </div>
    );
  }

  return (
    <>
      <div className="flex h-screen overflow-hidden">
        <div className="w-64 h-full fixed left-0 top-0">
          <SideBar />
        </div>
        <div className="flex-1 ml-20 overflow-y-auto p-8">
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
          <h2 className="text-xl font-semibold mb-8 mt-10">Notifications</h2>

          <div className="space-y-6">
            {notifications.map((n, idx) => (
              <div key={idx}
                className="alert alert-vertical sm:alert-horizontal flex items-center"
                onClick={() => markNotificationAsRead(n.notificationId)}>
                {!n.isRead && (
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 mr-2"></span>
                )}
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
    </>
  );
};

export default NotificationPage;
