import { usePathname, useRouter } from "next/navigation";
import { UserIcon, ChatBubbleOvalLeftIcon, BellIcon, ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import { useApi } from "@/hooks/useApi";
import { useLogout } from "@/hooks/useLogout";

const SideBar: React.FC = () => {
    const router = useRouter();
    const apiService = useApi();
    const pathname = usePathname();
    const logout = useLogout();

    const isChatPage = pathname.startsWith("/chat");
    const isNotificationsPage = pathname.startsWith("/notifications");

    const [hasUnreadNotifications, setHasUnreadNotifications] = useState<boolean>(false);
    const [hasUnreadMessages, setHasUnreadMessages] = useState<boolean>(false);

    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const response = await apiService.get<{ hasUnread: boolean }>("/notifications/unread");
                setHasUnreadNotifications(response.hasUnread || false);

                const messageResponse = await apiService.get<{ hasUnread: boolean }>("/messages/unread");
                setHasUnreadMessages(messageResponse.hasUnread || false);
            } catch (error) {
                console.error("Error checking unread notifications:", error);
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [apiService]);

    // logout
    const handleLogout = async () => {
        try {
            await apiService.put("/users/logout", {});
        } catch (error) {
            console.error("Logout API failed:", error);
        } finally {
            logout();
        }
    };

    return (
        <div className="h-screen w-20 flex flex-col items-center pt-5">
            <div className="tooltip tooltip-right" data-tip="Profile">
                <button
                    className="btn btn-circle btn-ghost hover:bg-base-300 transition-all"
                    onClick={() => router.push("/profile")}
                    title="Profile"
                >
                    <UserIcon className="h-6 w-6" />
                </button>
            </div>
            <div className="tooltip tooltip-right" data-tip="Messages">
                <button
                    className="btn btn-circle btn-ghost hover:bg-base-300 transition-all mt-4 relative"
                    onClick={() => router.push("/chat")}
                    title="Messages"
                >
                    <ChatBubbleOvalLeftIcon className="h-6 w-6" />
                    {hasUnreadMessages && !isChatPage && (
                        <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-red-500"></span>
                    )}
                </button>
            </div>
            <div className="tooltip tooltip-right" data-tip="Notifications">
                <button
                    className="btn btn-circle btn-ghost hover:bg-base-300 transition-all mt-4 relative"
                    onClick={() => router.push("/notifications")}
                    title="Notifications"
                >
                    <BellIcon className="h-6 w-6" />
                    {hasUnreadNotifications && !isNotificationsPage && (
                        <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-red-500"></span>
                    )}
                </button>
            </div>
            <div className="tooltip tooltip-right" data-tip="logout">
                <button
                    className="btn btn-circle btn-ghost hover:bg-base-300 transition-all mt-4"
                    onClick={handleLogout}
                    title="Logout"
                >
                    <ArrowRightStartOnRectangleIcon className="h-6 w-6" />
                </button>
            </div>
        </div>
    );
};

export default SideBar;