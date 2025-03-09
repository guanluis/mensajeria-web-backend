export interface Contact {
  id: string;
  name: string;
  avatar?: string;
  status?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
}
