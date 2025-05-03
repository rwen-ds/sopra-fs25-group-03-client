"use client";
import LoggedIn from '@/components/LoggedIn';
import SideBar from '@/components/SideBar';
import ContactList from '@/components/ContactList';

export default function ChatPage() {
    return (
        <>
            <div className="flex flex-col h-screen">
                <LoggedIn />
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
