import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

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
            webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
            reconnectDelay: 5000,
            onConnect: () => {
                this.connected = true;
                this.subscribeToMessages(userId, onMessageReceived);
                // this.fetchOfflineMessages(userId, onMessageReceived);
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
                        await fetch(`${window.location.origin}/api/messages/${parsed.senderId}/${userId}`, {
                            method: 'PUT',
                        });
                    } catch (error) {
                        console.error('Error marking message as read:', error);
                    }
                }

                callback(parsed);
            }
        );
    }

    private async fetchOfflineMessages(
        userId: number,
        callback: (message: MessageData) => void
    ) {
        try {
            const senderId = this.currentChatPartnerId;
            const response = await fetch(`http://localhost:8080/api/messages/${senderId}/${userId}`);
            const messages: MessageData[] = await response.json();
            messages.forEach(callback);
        } catch (error) {
            console.error('Error fetching offline messages:', error);
        }
    }
}

export const webSocketService = new WebSocketService();