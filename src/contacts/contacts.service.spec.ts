import { Test, TestingModule } from "@nestjs/testing";
import { ContactsService } from "./contacts.service";
import { SupabaseService } from "../supabase/supabase.service";

const mockSupabaseService = {
  client: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      neq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null, error: null }),
    })),
  },
};

describe("ContactsService", () => {
  let service: ContactsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactsService,
        {
          provide: SupabaseService,
          useValue: mockSupabaseService,
        },
      ],
    }).compile();

    service = module.get<ContactsService>(ContactsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
