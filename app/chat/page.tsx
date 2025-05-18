"use client";
import SideBar from '@/components/SideBar';
import ContactList from '@/components/ContactList';
import BackButton from '@/components/BackButton';
import useAuthRedirect from "@/hooks/useAuthRedirect";
import useLocalStorage from "@/hooks/useLocalStorage";

export default function ChatPage() {
    const { value: token } = useLocalStorage<string | null>('token', null);
    useAuthRedirect(token)
    return (
        <>
            <BackButton />
            <div className="flex flex-col h-screen">
                <div className="flex overflow-hidden bg-base-100">
                    <SideBar />
                    <ContactList />
                    <div className="h-full flex items-center justify-center text-base-content">
                        {/* default */}
                    </div>
                </div>
            </div>
        </>
    );
}
