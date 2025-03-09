import { Injectable, NotFoundException } from "@nestjs/common";
import { SupabaseService } from "../supabase/supabase.service"; // 🔹 Importación corregida
import type { Message } from "./interfaces/message.interface";
import type { CreateMessageDto } from "./dto/create-message.dto";

@Injectable()
export class MessagesService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async findAll(conversationId: string, page = 1, limit = 50): Promise<Message[]> {
    // Calculate offset based on page and limit
    const offset = (page - 1) * limit

    // Check if the conversation exists
    const { data: conversation, error: conversationError } = await this.supabaseService.client
      .from("conversations")
      .select("*")
      .eq("id", conversationId)
      .single()

    if (conversationError || !conversation) {
      throw new NotFoundException(`Conversation with ID ${conversationId} not found`)
    }

    // Get messages for the conversation with pagination
    const { data, error } = await this.supabaseService.client
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })
      .range(offset, offset + limit - 1)

    if (error) {
      throw new Error(`Error fetching messages: ${error.message}`)
    }

    return data.map((message) => ({
      id: message.id,
      conversationId: message.conversation_id,
      senderId: message.sender_id,
      content: message.content,
      imageUrl: message.image_url,
      createdAt: message.created_at,
    }))
  }

  async create(createMessageDto: CreateMessageDto, userId: string): Promise<Message> {
    // Check if the conversation exists and the user is a participant
    const { data: participant, error: participantError } = await this.supabaseService.client
      .from("participants")
      .select("*")
      .eq("conversation_id", createMessageDto.conversationId)
      .eq("user_id", userId)
      .single()

    if (participantError || !participant) {
      throw new NotFoundException(
        `Conversation with ID ${createMessageDto.conversationId} not found or user is not a participant`,
      )
    }

    // Create the message
    const { data, error } = await this.supabaseService.client
      .from("messages")
      .insert({
        conversation_id: createMessageDto.conversationId,
        sender_id: userId,
        content: createMessageDto.content,
        image_url: createMessageDto.imageUrl,
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Error creating message: ${error.message}`)
    }

    return {
      id: data.id,
      conversationId: data.conversation_id,
      senderId: data.sender_id,
      content: data.content,
      imageUrl: data.image_url,
      createdAt: data.created_at,
    }
  }
}

