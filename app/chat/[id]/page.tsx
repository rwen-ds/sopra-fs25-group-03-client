"use client";
import LoggedIn from '@/components/LoggedIn';
import SideBar from '@/components/SideBar';
import ContactList from '@/components/ContactList';
import ChatPanel from '@/components/ChatPanel';
import { useParams } from 'next/navigation';
import useLocalStorage from "@/hooks/useLocalStorage";
import { User } from '@/types/user';

export default function ChatWithUser() {
    const { id } = useParams();
    const { value: user } = useLocalStorage<User | null>("user", null);

    if (!id || !user) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    const userId = user?.id ?? 0;
    const recipientId = Number(id);

    return (
        <>
            <div className="flex flex-col h-screen">
                <LoggedIn />
                <div className="flex flex-1 overflow-hidden">
                    <SideBar />
                    <ContactList selectedUserId={recipientId} />
                    <ChatPanel userId={userId} recipientId={recipientId} />
                </div>
            </div>
        </>
    );
}
