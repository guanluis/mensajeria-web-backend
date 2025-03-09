import { Test, TestingModule } from "@nestjs/testing";
import { MessagesService } from "./messages.service";
import { SupabaseService } from "../supabase/supabase.service";

const mockSupabaseService = {
  client: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      range: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null, error: null }),
      insert: jest.fn().mockReturnThis(),
    })),
  },
};

describe("MessagesService", () => {
  let service: MessagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessagesService,
        {
          provide: SupabaseService,
          useValue: mockSupabaseService, // Se mockea correctamente
        },
      ],
    }).compile();

    service = module.get<MessagesService>(MessagesService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
