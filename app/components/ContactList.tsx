'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApi } from '@/hooks/useApi';

interface Contact {
    id: number;
    username: string;
    lastMessage?: string;
}

const avatarColors = [
    'bg-primary text-primary-content',
    'bg-secondary text-secondary-content',
    'bg-accent text-accent-content',
    'bg-info text-info-content',
    'bg-success text-success-content',
    'bg-warning text-warning-content',
    'bg-error text-error-content',
];

export default function ContactList({ selectedUserId }: { selectedUserId?: number }) {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const router = useRouter();
    const apiService = useApi();

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const data = await apiService.get<Contact[]>('/messages/contacts');
                setContacts(data.reverse());
            } catch (error) {
                console.error('Failed to fetch contacts:', error);
            }
        };

        fetchContacts();
    }, [apiService]);

    return (
        <div className="w-80 p-5 bg-base-100 border-r border-base-300 overflow-y-auto">
            <h3 className="text-xl font-semibold text-base-content mb-6">Previous Chats</h3>
            <div className="flex flex-col gap-3">
                {contacts.map((contact) => {
                    const colorClass = avatarColors[contact.id % avatarColors.length];

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
                                className={`w-11 h-11 rounded-full flex items-center justify-center font-bold shrink-0 ${colorClass}`}
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
                        </button>
                    );
                })}
            </div>
        </div>
    );

}
