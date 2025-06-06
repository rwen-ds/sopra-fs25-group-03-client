"use client";
import SideBar from '@/components/SideBar';
import ContactList from '@/components/ContactList';
import ChatPanel from '@/components/ChatPanel';
import { useParams } from 'next/navigation';
import useLocalStorage from "@/hooks/useLocalStorage";
import { User } from '@/types/user';
import BackButton from '@/components/BackButton';
import useAuthRedirect from "@/hooks/useAuthRedirect";

export default function ChatWithUser() {
    const { id } = useParams();
    const { value: user } = useLocalStorage<User | null>("user", null);
    const { value: token } = useLocalStorage<string | null>('token', null);
    useAuthRedirect(token)

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
            <BackButton />
            <div className="flex flex-col h-screen">
                <div className="flex flex-1 overflow-hidden">
                    <SideBar />
                    <ContactList selectedUserId={recipientId} />
                    <ChatPanel userId={userId} recipientId={recipientId} />
                </div>
            </div>
        </>
    );
}
