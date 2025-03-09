import { Test, type TestingModule } from "@nestjs/testing"
import { ContactsService } from "./contacts.service"
import { SupabaseService } from "../supabase/supabase.service"
import { NotFoundException } from "@nestjs/common"

// Mock de SupabaseService
const mockSupabaseService = {
  client: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    neq: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
    range: jest.fn().mockReturnThis(),
  },
}

describe("ContactsService", () => {
  let service: ContactsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactsService,
        {
          provide: SupabaseService,
          useValue: mockSupabaseService,
        },
      ],
    }).compile()

    service = module.get<ContactsService>(ContactsService)
  })

  it("should be defined", () => {
    expect(service).toBeDefined()
  })

  describe("findOne", () => {
    it("should throw NotFoundException when conversation not found", async () => {
      // Mock para simular que no se encuentra la conversación
      mockSupabaseService.client
        .from()
        .select()
        .eq()
        .eq()
        .single.mockResolvedValue({
          data: null,
          error: { message: "Not found" },
        })

      await expect(service.findOne("non-existent-id", "user-id")).rejects.toThrow(NotFoundException)
    })

    // Aquí irían más pruebas para el método findOne
  })

  // Aquí irían más pruebas para otros métodos
})

