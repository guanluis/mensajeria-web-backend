import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import type { Contact } from './interfaces/contact.interface';

@Injectable()
export class ContactsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async findAll(userId: string): Promise<Contact[]> {
    // Get all conversations where the user is a participant
    const { data: conversations, error: conversationsError } = await this.supabaseService.client
      .from('conversations')
      .select('id, participants!inner(*)')
      .eq('participants.user_id', userId);

    if (conversationsError) {
      throw new Error(`Error fetching conversations: ${conversationsError.message}`);
    }

    // Extract the conversation IDs
    const conversationIds = conversations.map(conv => conv.id);

    // For each conversation, get the other participant's details
    const contacts: Contact[] = [];

    for (const conversationId of conversationIds) {
      // Get the other participant in this conversation
      const { data: participants, error: participantsError } = await this.supabaseService.client
        .from('participants')
        .select('user_id')
        .eq('conversation_id', conversationId)
        .neq('user_id', userId);

      if (participantsError) {
        throw new Error(`Error fetching participants: ${participantsError.message}`);
      }

      if (participants.length === 0) continue;

      const otherUserId = participants[0].user_id;

      // Get the user details
      const { data: userData, error: userError } = await this.supabaseService.client
        .from('profiles')
        .select('*')
        .eq('id', otherUserId)
        .single();

      if (userError) {
        throw new Error(`Error fetching user profile: ${userError.message}`);
      }

      // Get the last message in the conversation
      const { data: lastMessage, error: messageError } = await this.supabaseService.client
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (messageError && messageError.code !== 'PGRST116') {
        // PGRST116 is "No rows returned" which is fine
        throw new Error(`Error fetching last message: ${messageError.message}`);
      }

      contacts.push({
        id: conversationId,
        name: userData.full_name || userData.username,
        avatar: userData.avatar_url,
        status: userData.status || 'Offline',
        lastMessage: lastMessage?.content,
        lastMessageTime: lastMessage?.created_at,
        unreadCount: 0, // This would need additional logic to calculate
      });
    }

    return contacts;
  }

  async search(query: string, userId: string): Promise<Contact[]> {
    // First get all contacts
    const allContacts = await this.findAll(userId);

    // Then filter by the search query
    return allContacts.filter(contact => contact.name.toLowerCase().includes(query.toLowerCase()));
  }

  async findOne(id: string, userId: string): Promise<Contact> {
    // Check if the conversation exists and the user is a participant
    const { data: participant, error: participantError } = await this.supabaseService.client
      .from('participants')
      .select('*')
      .eq('conversation_id', id)
      .eq('user_id', userId)
      .single();

    if (participantError || !participant) {
      throw new NotFoundException(
        `Conversation with ID ${id} not found or user is not a participant`,
      );
    }

    // Get the other participant in this conversation
    const { data: otherParticipant, error: otherParticipantError } =
      await this.supabaseService.client
        .from('participants')
        .select('user_id')
        .eq('conversation_id', id)
        .neq('user_id', userId)
        .single();

    if (otherParticipantError || !otherParticipant) {
      throw new NotFoundException(`Other participant in conversation with ID ${id} not found`);
    }

    // Get the user details
    const { data: userData, error: userError } = await this.supabaseService.client
      .from('profiles')
      .select('*')
      .eq('id', otherParticipant.user_id)
      .single();

    if (userError || !userData) {
      throw new NotFoundException(`User profile for ID ${otherParticipant.user_id} not found`);
    }

    // Get the last message in the conversation
    const { data: lastMessage, error: messageError } = await this.supabaseService.client
      .from('messages')
      .select('*')
      .eq('conversation_id', id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    // PGRST116 is "No rows returned" which is fine for a new conversation
    if (messageError && messageError.code !== 'PGRST116') {
      throw new Error(`Error fetching last message: ${messageError.message}`);
    }

    return {
      id,
      name: userData.full_name || userData.username,
      avatar: userData.avatar_url,
      status: userData.status || 'Offline',
      lastMessage: lastMessage?.content,
      lastMessageTime: lastMessage?.created_at,
      unreadCount: 0, // This would need additional logic to calculate
    };
  }
}
