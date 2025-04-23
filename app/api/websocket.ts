import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { getApiDomain } from "@/utils/domain";

interface MessageData {
    senderId: number;
    recipientId: number;
    content: string;
    timestamp: string;
    isRead: boolean;
}

class WebSocketService {
    private stompClient: Client | null = null;
    private subscriptions: Record<string, StompSubscription> = {};
    private connected = false;
    private currentChatPartnerId: number | null = null;
    private baseUrl: string;

    constructor() {
        this.baseUrl = `${getApiDomain()}/ws`;
    }

    public setCurrentChatPartner(partnerId: number) {
        this.currentChatPartnerId = partnerId;
    }

    public connect(
        userId: number,
        onMessageReceived: (message: MessageData) => void,
        onError?: (error: unknown) => void,
        onConnect?: () => void
    ) {
        this.stompClient = new Client({
            webSocketFactory: () => new SockJS(this.baseUrl),
            reconnectDelay: 5000,
            onConnect: () => {
                this.connected = true;
                this.subscribeToMessages(userId, onMessageReceived);
                if (onConnect) onConnect();
            },
            onStompError: (frame) => {
                console.error('STOMP error:', frame.headers['message']);
                if (onError) onError(frame);
            },
            debug: () => { },
        });

        this.stompClient.activate(); // Activate the client to establish the connection
    }



    public disconnect() {
        if (this.stompClient && this.connected) {
            Object.values(this.subscriptions).forEach(sub => sub.unsubscribe());
            this.subscriptions = {};

            this.stompClient.deactivate();
            this.stompClient = null;
            this.connected = false;
        }
    }

    public sendMessage(message: Omit<MessageData, 'timestamp' | 'isRead'>) {
        if (this.stompClient && this.connected) {
            this.stompClient.publish({
                destination: '/app/chat.send',
                body: JSON.stringify(message),
            });
        }
    }

    private subscribeToMessages(
        userId: number,
        callback: (message: MessageData) => void
    ) {
        if (!this.stompClient) return;

        this.subscriptions[userId] = this.stompClient.subscribe(
            `/topic/messages/${userId}`,
            async (message: IMessage) => {
                const parsed: MessageData = JSON.parse(message.body);

                if (
                    this.currentChatPartnerId !== null &&
                    parsed.senderId === this.currentChatPartnerId
                ) {
                    try {
                        // 清理 baseUrl，确保末尾没有斜杠
                        const cleanedBaseUrl = this.baseUrl.endsWith('/') ? this.baseUrl.slice(0, -1) : this.baseUrl;
                        // 替换 /ws 并进行路径拼接
                        const apiUrl = cleanedBaseUrl.replace('/ws', '') + `/messages/${parsed.senderId}/${userId}`;
                        await fetch(apiUrl, {
                            method: 'PUT',
                        });
                        // await fetch(`${this.baseUrl.replace('/ws', '')}/messages/${parsed.senderId}/${userId}`, {
                        //     method: 'PUT',
                        // });
                    } catch (error) {
                        console.error('Error marking message as read:', error);
                    }
                }

                callback(parsed);
            }
        );
    }
}

export const webSocketService = new WebSocketService();