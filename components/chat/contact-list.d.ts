import type { Contact } from "@/lib/types";
interface ContactListProps {
    contacts: Contact[];
    selectedContactId: string | null;
    onSelectContact: (id: string) => void;
}
export default function ContactList({ contacts, selectedContactId, onSelectContact }: ContactListProps): any;
export {};
