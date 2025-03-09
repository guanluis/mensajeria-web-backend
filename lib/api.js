"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchContacts = fetchContacts;
exports.searchContacts = searchContacts;
exports.fetchMessages = fetchMessages;
exports.sendMessage = sendMessage;
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
async function fetchContacts() {
    const response = await fetch(`${API_BASE_URL}/contacts`);
    if (!response.ok) {
        throw new Error(`Failed to fetch contacts: ${response.statusText}`);
    }
    return response.json();
}
async function searchContacts(query) {
    const response = await fetch(`${API_BASE_URL}/contacts/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
        throw new Error(`Failed to search contacts: ${response.statusText}`);
    }
    return response.json();
}
async function fetchMessages(conversationId, page = 1, limit = 50) {
    const response = await fetch(`${API_BASE_URL}/messages/${conversationId}?page=${page}&limit=${limit}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch messages: ${response.statusText}`);
    }
    return response.json();
}
async function sendMessage(messageData) {
    const response = await fetch(`${API_BASE_URL}/messages`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(messageData),
    });
    if (!response.ok) {
        throw new Error(`Failed to send message: ${response.statusText}`);
    }
    return response.json();
}
//# sourceMappingURL=api.js.map