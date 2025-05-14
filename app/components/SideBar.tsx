import { usePathname, useRouter } from "next/navigation";
import { UserIcon, ChatBubbleOvalLeftIcon, BellIcon, ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import { useApi } from "@/hooks/useApi";
import { useLogout } from "@/hooks/useLogout";
import Link from "next/link";

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
        const fetchData = async () => {
            try {
                const response = await apiService.get<{ hasUnread: boolean }>("/notifications/unread");
                setHasUnreadNotifications(response.hasUnread || false);

                const messageResponse = await apiService.get<{ hasUnread: boolean }>("/messages/unread");
                setHasUnreadMessages(messageResponse.hasUnread || false);
            } catch (error) {
                console.error("Error checking unread notifications:", error);
            }
        };

        fetchData();
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
            <Link href="/logged-in">
                <button
                    className="btn btn-neutral hover:bg-base-300 transition-all w-20 mt-2 ml-8 mb-6"
                    title="Home"
                >
                    Home
                </button>
            </Link>
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
                    onClick={() => {
                        const modal = document.getElementById("logout_modal") as HTMLDialogElement;
                        modal?.showModal();
                    }}
                    title="Logout"
                >
                    <ArrowRightStartOnRectangleIcon className="h-6 w-6" />
                </button>

                <dialog id="logout_modal" className="modal">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Confirm Logout</h3>
                        <p className="py-4">Are you sure you want to log out?</p>
                        <div className="modal-action">
                            <form method="dialog" className="space-x-2">
                                <button className="btn">Cancel</button>
                                <button
                                    className="btn btn-neutral"
                                    onClick={async () => {
                                        await handleLogout();
                                    }}
                                >
                                    Log out
                                </button>
                            </form>
                        </div>
                    </div>
                </dialog>
            </div>
        </div>
    );
};

export default SideBar;