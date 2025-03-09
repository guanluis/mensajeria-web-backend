import { Test, type TestingModule } from "@nestjs/testing"
import { MessagesService } from "./messages.service"
import { SupabaseService } from "../supabase/supabase.service"
import { NotFoundException } from "@nestjs/common"
import type { CreateMessageDto } from "./dto/create-message.dto"

// Mock de SupabaseService
const mockSupabaseService = {
  client: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    range: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
  },
}

describe("MessagesService", () => {
  let service: MessagesService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessagesService,
        {
          provide: SupabaseService,
          useValue: mockSupabaseService,
        },
      ],
    }).compile()

    service = module.get<MessagesService>(MessagesService)
  })

  it("should be defined", () => {
    expect(service).toBeDefined()
  })

  describe("findAll", () => {
    it("should throw NotFoundException when conversation not found", async () => {
      // Mock para simular que no se encuentra la conversación
      mockSupabaseService.client
        .from()
        .select()
        .eq()
        .single.mockResolvedValue({
          data: null,
          error: { message: "Not found" },
        })

      await expect(service.findAll("non-existent-id")).rejects.toThrow(NotFoundException)
    })

    // Aquí irían más pruebas para el método findAll
  })

  describe("create", () => {
    it("should create a message successfully", async () => {
      // Mock para simular que se encuentra el participante
      mockSupabaseService.client
        .from()
        .select()
        .eq()
        .eq()
        .single.mockResolvedValue({
          data: { id: "participant-id" },
          error: null,
        })

      // Mock para simular la creación exitosa del mensaje
      mockSupabaseService.client
        .from()
        .insert()
        .select()
        .single.mockResolvedValue({
          data: {
            id: "message-id",
            conversation_id: "conversation-id",
            sender_id: "user-id",
            content: "Hello",
            image_url: null,
            created_at: "2023-01-01T00:00:00Z",
          },
          error: null,
        })

      const dto: CreateMessageDto = {
        conversationId: "conversation-id",
        content: "Hello",
      }

      const result = await service.create(dto, "user-id")

      expect(result).toEqual({
        id: "message-id",
        conversationId: "conversation-id",
        senderId: "user-id",
        content: "Hello",
        imageUrl: null,
        createdAt: "2023-01-01T00:00:00Z",
      })
    })

    // Aquí irían más pruebas para el método create
  })
})

