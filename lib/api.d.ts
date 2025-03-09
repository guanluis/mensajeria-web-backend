import type { Contact, Message } from "./types";
export declare function fetchContacts(): Promise<Contact[]>;
export declare function searchContacts(query: string): Promise<Contact[]>;
export declare function fetchMessages(conversationId: string, page?: number, limit?: number): Promise<Message[]>;
export declare function sendMessage(messageData: {
    conversationId: string;
    senderId: string;
    content?: string;
    imageUrl?: string | null;
}): Promise<Message>;
