"use client"
import { useState, useEffect } from 'react';
import { webSocketService } from '../api/websocket';

interface Message {
    senderId: number;
    recipientId: number;
    content: string;
    timestamp: string;
    isRead: boolean;
}

export default function ChatTestPage() {
    const [userId, setUserId] = useState<number>(1);
    const [recipientId, setRecipientId] = useState<number>(2);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [connectionStatus, setConnectionStatus] = useState('Disconnected');

    useEffect(() => {
        // 建立连接
        webSocketService.connect(
            userId,
            (newMessage) => {
                setMessages((prev) => [...prev, newMessage]);
                console.log('Received message:', newMessage);
            },
            (error) => {
                console.error('WebSocket error:', error);
                setConnectionStatus('Connection failed');
            },
            () => {
                setConnectionStatus('Connected');
            }
        );

        return () => {
            webSocketService.disconnect();
            setConnectionStatus('Disconnected');
        };
    }, [userId]);

    useEffect(() => {
        webSocketService.setCurrentChatPartner(recipientId);

        const fetchHistory = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/messages/${recipientId}/${userId}`);
                const data: Message[] = await response.json();
                setMessages(data);
            } catch (err) {
                console.error('Failed to fetch chat history', err);
            }
        };

        fetchHistory();
    }, [recipientId, userId]);

    useEffect(() => {
        const chatBox = document.getElementById('chat-box');
        if (chatBox) {
            chatBox.scrollTop = chatBox.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = () => {
        if (!message.trim()) return;

        const newMessage = {
            senderId: userId,
            recipientId,
            content: message,
        };

        // 发送消息
        webSocketService.sendMessage(newMessage);

        setMessages((prev) => [
            ...prev,
            {
                ...newMessage,
                timestamp: new Date().toISOString(),
                isRead: false,
            },
        ]);

        // 清空输入框
        setMessage('');
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <h1>WebSocket Chat Test</h1>
            <div>
                <p>Connection status: <strong>{connectionStatus}</strong></p>
            </div>

            <div style={{ margin: '20px 0' }}>
                <label>
                    Your User ID:
                    <input
                        type="number"
                        value={userId}
                        onChange={(e) => setUserId(Number(e.target.value))}
                        style={{ marginLeft: '10px' }}
                    />
                </label>

                <label style={{ marginLeft: '20px' }}>
                    Recipient ID:
                    <input
                        type="number"
                        value={recipientId}
                        onChange={(e) => setRecipientId(Number(e.target.value))}
                        style={{ marginLeft: '10px' }}
                    />
                </label>
            </div>

            <div
                id="chat-box"
                style={{
                    border: '1px solid #ccc',
                    padding: '10px',
                    height: '300px',
                    overflowY: 'auto',
                    backgroundColor: '#fafafa',
                }}
            >
                {messages.map((msg, index) => (
                    <div key={index} style={{ marginBottom: '10px' }}>
                        <div>
                            <strong>{msg.senderId === userId ? 'You' : `User ${msg.senderId}`}:</strong>
                            <span style={{ marginLeft: '10px' }}>{msg.content}</span>
                        </div>
                        <div style={{ fontSize: '0.8em', color: '#666' }}>
                            {new Date(msg.timestamp).toLocaleString()}
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: '20px' }}>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message here..."
                    style={{ width: '70%', padding: '8px' }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            handleSendMessage();
                        }
                    }}
                />
                <button
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    style={{ marginLeft: '10px', padding: '8px 15px' }}
                >
                    Send
                </button>
            </div>

            <div style={{ marginTop: '20px', fontSize: '0.9em', color: '#666' }}>
                <p>Testing instructions:</p>
                <ul>
                    <li>Open two browser windows/tabs</li>
                    <li>Set different User IDs in each (e.g., 1 and 2)</li>
                    <li>Send messages between them</li>
                    <li>Check console logs for WebSocket activity</li>
                </ul>
            </div>
        </div>
    );
}
