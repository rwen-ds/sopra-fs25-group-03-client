'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApi } from '@/hooks/useApi';

interface Contact {
    id: number;
    username: string;
    lastMessage?: string;
}

export default function ContactList({ selectedUserId }: { selectedUserId?: number }) {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const router = useRouter();
    const apiService = useApi();

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const data = await apiService.get<Contact[]>('/messages/contacts');
                setContacts(data.reverse()); // Newest messages first
            } catch (error) {
                console.error('Failed to fetch contacts:', error);
            }
        };

        fetchContacts();
    }, [apiService]);

    // Function to generate a color based on the string
    function stringToColor(str: string) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        const hue = hash % 360;
        return `hsl(${hue}, 70%, 60%)`;
    }

    return (
        <div className="w-80 p-4 bg-base-100 border-r border-base-300 overflow-y-auto">
            <h3 className="text-xl font-semibold text-base-content mb-6">Previous Chats</h3>
            <div className="flex flex-col gap-3">
                {contacts.map((contact) => (
                    <div
                        key={contact.id}
                        className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition 
              ${selectedUserId === contact.id
                                ? 'bg-blue-100 border-2 border-blue-500 shadow'
                                : 'bg-base-100 border border-base-200 hover:bg-base-200'
                            }`}
                        onClick={() => router.push(`/chat/${contact.id}`)}
                    >
                        {/* Avatar */}
                        <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shrink-0"
                            style={{ backgroundColor: stringToColor(contact.username) }}
                        >
                            {contact.username.charAt(0).toUpperCase()}
                        </div>

                        {/* Contact Info */}
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-base font-medium text-base-content truncate w-44">
                                {contact.username}
                            </span>
                            <span className="text-sm text-base-content/60 truncate w-44">
                                {contact.lastMessage || 'No messages yet'}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
