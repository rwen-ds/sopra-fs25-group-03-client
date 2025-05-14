"use client";
import SideBar from '@/components/SideBar';
import ContactList from '@/components/ContactList';
import BackButton from '@/components/BackButton';

export default function ChatPage() {
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
