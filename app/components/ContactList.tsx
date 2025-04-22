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
                setContacts(data.reverse()); // 最新联系人在上面
            } catch (error) {
                console.error('Failed to fetch contacts:', error);
            }
        };

        fetchContacts();
    }, [apiService]);
    // 工具函数：根据字符串生成颜色
    function stringToColor(str: string) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }

        const hue = hash % 360; // 生成 HSL 色相
        return `hsl(${hue}, 70%, 60%)`; // 明亮色系
    }


    return (
        <div style={{ width: '280px', borderRight: '1px solid #ddd', padding: '1rem', backgroundColor: '#fefefe' }}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.3em', fontWeight: 600, color: '#222' }}>Previous Chats</h3>
            {contacts.map((contact) => (
                <div
                    key={contact.id}
                    onClick={() => router.push(`/chat/${contact.id}`)}
                    style={{
                        display: 'flex',
                        gap: '0.75rem',
                        alignItems: 'center',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        backgroundColor: selectedUserId === contact.id ? '#e6f4ff' : '#fff',
                        border: selectedUserId === contact.id ? '2px solid #1890ff' : '1px solid #eee',
                        boxShadow: selectedUserId === contact.id ? '0 2px 6px rgba(0, 0, 0, 0.05)' : 'none',
                        cursor: 'pointer',
                        marginBottom: '12px',
                        transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = '#f5f5f5';
                    }}
                    onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.backgroundColor =
                            selectedUserId === contact.id ? '#e6f4ff' : '#fff';
                    }}
                >
                    {/* Avatar circle with first letter */}
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: stringToColor(contact.username), // 🎨 随用户名生成颜色
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: '1em',
                        flexShrink: 0,
                    }}>
                        {contact.username.charAt(0).toUpperCase()}
                    </div>


                    {/* Contact text info */}
                    <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        <span style={{
                            fontSize: '1em',
                            fontWeight: 500,
                            color: '#333',
                            marginBottom: '4px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: '180px',
                        }}>
                            {contact.username}
                        </span>
                        <span style={{
                            fontSize: '0.85em',
                            color: '#888',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: '180px',
                        }}>
                            {contact.lastMessage || 'No messages yet'}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}
