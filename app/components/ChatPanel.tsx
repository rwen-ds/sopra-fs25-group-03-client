'use client';

import { useEffect, useState, useRef } from 'react';
import { useApi } from '@/hooks/useApi';
import { User } from '@/types/user';

interface Message {
    senderId: number;
    recipientId: number;
    content: string;
    timestamp: string;
    isRead: boolean;
}

interface TransMsg {
    translatedText: string;
}

export default function ChatPanel({ userId, recipientId }: { userId: number; recipientId: number }) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [message, setMessage] = useState('');
    const apiService = useApi();
    const chatBoxRef = useRef<HTMLDivElement>(null);
    const [targetLanguage, setTargetLanguage] = useState("en");
    const [translatedMessages, setTranslatedMessages] = useState<{ [key: string]: string }>({});
    const [recipient, setRecipient] = useState<User | null>(null);

    useEffect(() => {
        const fetchRecipientName = async () => {
            try {
                const data: User = await apiService.get(`/users/${recipientId}`);
                setRecipient(data);
            } catch (err) {
                console.error('Failed to fetch recipient info:', err);
            }
        };

        if (recipientId) {
            fetchRecipientName();
        }
    }, [apiService, recipientId]);

    useEffect(() => {
        let isCancelled = false;

        const pollMessages = async () => {
            while (!isCancelled) {
                try {
                    const res = await apiService.get<Response>(`/messages/poll/${userId}`);
                    const message = await res.text();
                    if (message !== 'timeout') {
                        const [sender, ...rest] = message.split(":");
                        const content = rest.join(":");

                        const newMsg: Message = {
                            senderId: parseInt(sender),
                            recipientId: userId,
                            content,
                            timestamp: new Date().toISOString(),
                            isRead: false,
                        };

                        if (parseInt(sender) === recipientId) {
                            setMessages((prev) => [...prev, newMsg]);
                        }
                    }
                } catch (err) {
                    console.error("Polling error:", err);
                    await new Promise((r) => setTimeout(r, 3000)); // wait before retrying
                }
            }
        };

        pollMessages();

        return () => {
            isCancelled = true;
        };
    }, [userId, recipientId, apiService]);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const data: Message[] = await apiService.get(`/messages/conversation/${userId}/${recipientId}`);
                setMessages(data);
            } catch (err) {
                console.error('Failed to fetch messages:', err);
            }
        };

        fetchHistory();
    }, [apiService, recipientId, userId]);



    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!message.trim()) return;

        const newMsg = {
            senderId: userId,
            recipientId,
            content: message,
        };

        try {
            await apiService.post('/messages/send', newMsg);

            setMessages((prev) => [
                ...prev,
                {
                    ...newMsg,
                    timestamp: new Date().toISOString(),
                    isRead: false,
                },
            ]);

            setMessage('');
        } catch (err) {
            console.error("Failed to send message:", err);
        }
    };

    const handleTranslate = async (msgContent: string, msgId: string) => {
        try {
            const response = await apiService.get<TransMsg>(`/translate?text=${encodeURIComponent(msgContent)}&target=${encodeURIComponent(targetLanguage)}`);

            setTranslatedMessages((prev) => ({
                ...prev,
                [msgId]: response.translatedText,
            }));
        } catch (error) {
            console.error('Error translating message:', error);
        }
    };

    return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1rem' }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem',
            }}>
                <h2 style={{
                    fontSize: '1.5rem',
                    fontWeight: 600,
                    color: '#333',
                    margin: 0,
                }}>
                    {recipient?.username || '...'}
                </h2>

                <div style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginBottom: '16px'
                }}>
                    <div style={{
                        backgroundColor: '#f0f0f0',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        fontSize: '0.9em',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <span style={{ color: '#333' }}>Translate to:</span>
                        <select
                            value={targetLanguage}
                            onChange={(e) => setTargetLanguage(e.target.value)}
                            style={{
                                padding: '6px 10px',
                                borderRadius: '6px',
                                border: '1px solid #ccc',
                                outline: 'none',
                                backgroundColor: 'white',
                                fontSize: '0.9em'
                            }}
                        >
                            <option value="en">English</option>
                            <option value="zh">中文</option>
                            <option value="de">Deutsch</option>
                            <option value="fr">Français</option>
                            <option value="it">Italiano</option>
                        </select>
                    </div>
                </div>
            </div>

            <div
                ref={chatBoxRef}
                style={{
                    flex: 1,
                    overflowY: 'auto',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    padding: '1rem',
                    backgroundColor: '#fafafa',
                }}
            >
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        style={{
                            textAlign: msg.senderId === userId ? 'right' : 'left',
                            marginBottom: '12px',
                        }}
                    >
                        <div
                            style={{
                                display: 'inline-block',
                                padding: '10px',
                                borderRadius: '10px',
                                backgroundColor: msg.senderId === userId ? '#bae7ff' : '#f5f5f5',
                            }}
                        >
                            {msg.content}
                        </div>

                        {/* put translate button at the bottom of messages */}
                        <div style={{ marginTop: '8px' }}>
                            <button
                                onClick={() => handleTranslate(msg.content, idx.toString())}
                                style={{
                                    fontSize: '0.75em',
                                    padding: '4px 8px',
                                    borderRadius: '5px',
                                    backgroundColor: '#cccccc',
                                    color: '#555',
                                    border: 'none',
                                    cursor: 'pointer',
                                    display: 'inline-block',
                                }}
                            >
                                Translate
                            </button>
                        </div>

                        {/* show translated message */}
                        {translatedMessages[idx] && (
                            <div
                                style={{
                                    marginTop: '8px',
                                    padding: '6px 10px',
                                    borderRadius: '8px',
                                    backgroundColor: '#e0e0e0',
                                    fontSize: '0.9em',
                                    color: '#555',
                                    display: 'inline-block',
                                    wordBreak: 'break-word',
                                }}
                            >
                                {translatedMessages[idx]}
                            </div>
                        )}
                    </div>
                ))}

            </div>

            <div style={{ marginTop: '1rem', display: 'flex' }}>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    style={{ flex: 1, padding: '10px' }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSend();
                    }}
                />
                <button onClick={handleSend} disabled={!message.trim()} style={{ marginLeft: '10px', padding: '10px 16px' }}>
                    Send
                </button>
            </div>
        </div>
    );
}
