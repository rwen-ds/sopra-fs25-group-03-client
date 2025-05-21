'use client';

import { useEffect, useState, useRef } from 'react';
import { useApi } from '@/hooks/useApi';
import { User } from '@/types/user';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

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
    const [targetLanguage, setTargetLanguage] = useState('en');
    const [translatedMessages, setTranslatedMessages] = useState<{ [key: string]: string }>({});
    const [recipient, setRecipient] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [translatingIndex, setTranslatingIndex] = useState<string | null>(null);


    useEffect(() => {
        let isCancelled = false;

        const pollMessages = async () => {
            while (!isCancelled) {
                try {
                    const res = await apiService.get<Response>(`/messages/poll/${userId}`);
                    const message = await res.text();
                    if (message !== 'timeout') {
                        const [sender, ...rest] = message.split(':');
                        const content = rest.join(':');

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
                    console.error('Polling error:', err);
                    await new Promise((r) => setTimeout(r, 3000));
                }
            }
        };

        pollMessages();

        return () => {
            isCancelled = true;
        };
    }, [userId, recipientId, apiService]);

    useEffect(() => {
        if (!userId || !recipientId) return;

        setMessages([]);
        setLoading(true);

        const fetchConversationData = async () => {
            try {
                const [recipientData, messageData, currentUserData] = await Promise.all([
                    apiService.get<User>(`/users/${recipientId}`),
                    apiService.get<Message[]>(`/messages/conversation/${userId}/${recipientId}`),
                    apiService.get<User>(`/users/${userId}`),
                ]);
                setRecipient(recipientData);
                setMessages(messageData);

                setTargetLanguage((prev) =>
                    prev === 'en' ? currentUserData.language || 'en' : prev
                );

                await apiService.put(`/messages/mark-read/${recipientId}/${userId}`, {});
            } catch (err) {
                console.error('Failed to fetch conversation data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchConversationData();
    }, [apiService, recipientId, userId]);

    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        return () => {
            // mark as read when leave
            if (userId && recipientId) {
                apiService.put(`/messages/mark-read/${recipientId}/${userId}`, {})
                    .catch(err => {
                        console.error('Failed to mark messages as read on unmount:', err);
                    });
            }
        };
    }, [apiService, userId, recipientId]);


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
            console.error('Failed to send message:', err);
        }
    };

    const handleTranslate = async (msgContent: string, msgId: string) => {
        const decodeHtml = (html: string) => {
            const parser = new DOMParser();
            const decoded = parser.parseFromString(html, 'text/html').body.textContent;
            return decoded || html;
        };
        try {
            setTranslatingIndex(msgId);
            const response = await apiService.get<TransMsg>(
                `/translate?text=${encodeURIComponent(msgContent)}&target=${encodeURIComponent(targetLanguage)}`
            );
            const decodedText = decodeHtml(response.translatedText);

            setTranslatedMessages((prev) => ({
                ...prev,
                [msgId]: decodedText,
            }));
        } catch (error) {
            console.error('Error translating message:', error);
        } finally {
            setTranslatingIndex(null);
        }
    };

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center text-lg">
                <span className="loading loading-dots loading-xs"></span>
            </div>
        );
    }

    return (
        <div className="flex flex-col flex-1 p-4">
            <div className="flex justify-between items-center mb-4 mt-10">
                <Link
                    href={`/users/${recipient?.id}`}
                    className="text-xl font-semibold text-neutral transition duration-200 ease-in-out hover:scale-[1.05]"
                >{recipient?.username || '...'}</Link>
                <div className="flex items-center gap-2 bg-base-200 px-3 py-2 rounded-md">
                    <span className="text-sm font-medium whitespace-nowrap">Translate to:</span>
                    <select
                        className="select select-sm select-bordered"
                        value={targetLanguage}
                        onChange={(e) => setTargetLanguage(e.target.value)}
                    >
                        <option value="en">English</option>
                        <option value="de">Deutsch</option>
                        <option value="fr">Français</option>
                        <option value="it">Italiano</option>
                        <option value="zh">中文</option>
                        <option value="es">Español</option>
                        <option value="ja">日本語</option>
                        <option value="ko">한국어</option>
                    </select>
                </div>
            </div>

            <div
                ref={chatBoxRef}
                className="flex-1 overflow-y-auto bg-base-100 border border-base-300 rounded-lg p-4 space-y-4"
            >
                {messages.map((msg, idx) => (
                    <div key={`${msg.senderId}-${msg.timestamp}`} className={`chat ${msg.senderId === userId ? 'chat-end' : 'chat-start'} flex flex-col`}>

                        <div className="chat-bubble bg-base-200">{msg.content}</div>

                        <button
                            onClick={() => handleTranslate(msg.content, idx.toString())}
                            className="btn btn-xs mt-1"
                        >
                            Translate
                        </button>

                        {(translatingIndex === idx.toString() || translatedMessages[idx]) && (
                            <div className="mt-1 bg-base-300 text-sm px-3 py-2 rounded-lg max-w-xs break-words">
                                {translatingIndex === idx.toString() && !translatedMessages[idx]
                                    ? <span className="loading loading-dots loading-xs"></span>
                                    : translatedMessages[idx]}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-4 flex items-center gap-2">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Type a message..."
                    className="input input-bordered flex-1"
                    maxLength={250}
                />
                <button
                    className="btn btn-square btn-neutral"
                    onClick={handleSend}
                    disabled={!message.trim()}
                >
                    <PaperAirplaneIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
