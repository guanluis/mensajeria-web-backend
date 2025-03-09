import type { Message } from "@/lib/types";
interface MessageListProps {
    messages: Message[];
    currentUserId: string;
}
export default function MessageList({ messages, currentUserId }: MessageListProps): any;
export {};
