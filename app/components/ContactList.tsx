'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApi } from '@/hooks/useApi';

interface Contact {
    id: number;
    username: string;
    // lastMessage?: string;
}

export default function ContactList({ selectedUserId }: { selectedUserId?: number }) {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const router = useRouter();
    const apiService = useApi();
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        setLoading(true);

        const fetchContacts = async () => {
            try {
                const data = await apiService.get<Contact[]>('/messages/contacts');
                setContacts(data.reverse());
            } catch (error) {
                console.error('Failed to fetch contacts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchContacts();

        const intervalId = setInterval(fetchContacts, 5000);

        return () => clearInterval(intervalId);
    }, [apiService]);


    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center text-lg">
                <span className="loading loading-dots loading-xs"></span>
            </div>
        );
    }

    return (
        <div className="w-80 p-5 bg-base-100 border-r border-base-300 overflow-y-auto mt-15">
            <h3 className="text-xl font-semibold text-base-content mb-6">Previous Chats</h3>
            <div className="flex flex-col gap-3">
                {contacts.map((contact) => {
                    return (
                        <button
                            key={contact.id}
                            className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-200 text-left w-full
                    ${selectedUserId === contact.id
                                    ? 'bg-base-200 border border-base-300'
                                    : 'bg-base-100 border border-base-200 hover:bg-base-200'
                                }`}
                            onClick={() => router.push(`/chat/${contact.id}`)}
                        >
                            {/* Avatar */}
                            <div
                                className={"w-11 h-11 rounded-full flex items-center justify-center font-bold shrink-0 bg-neutral text-neutral-content"}
                            >
                                {contact.username.charAt(0).toUpperCase()}
                            </div>

                            {/* Contact Info */}
                            <div className="flex flex-col overflow-hidden">
                                <span className="text-base font-medium text-base-content truncate w-44">
                                    {contact.username}
                                </span>
                                {/* <span className="text-sm text-base-content/60 truncate w-44">
                                    {contact.lastMessage || 'No messages yet'}
                                </span> */}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );

}
