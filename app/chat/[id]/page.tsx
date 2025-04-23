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
    const userId = user?.id ?? 0;
    const recipientId = Number(id);

    return (
        <>
            <LoggedIn />
            <div style={{ display: 'flex', height: 'calc(100vh - 80px)', overflow: 'hidden' }}>
                <SideBar />
                <ContactList selectedUserId={recipientId} />
                <ChatPanel userId={userId} recipientId={recipientId} />
            </div>
        </>
    );
}
