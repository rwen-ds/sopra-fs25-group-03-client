"use client";
import LoggedIn from '@/components/LoggedIn';
import SideBar from '@/components/SideBar';
import ContactList from '@/components/ContactList';

export default function ChatPage() {
    return (
        <>
            <LoggedIn />
            <div style={{ display: 'flex', height: 'calc(100vh - 80px)', overflow: 'hidden' }}>
                <SideBar />
                <ContactList />
                <div style={{ flex: 1, padding: '2rem' }}>
                    {/* default */}
                </div>
            </div>
        </>
    );
}
