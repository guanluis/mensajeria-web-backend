import { Test, type TestingModule } from "@nestjs/testing"
import { type ExecutionContext, UnauthorizedException } from "@nestjs/common"
import { AuthGuard } from "./auth.guard"
import { SupabaseService } from "../supabase/supabase.service"

// Mock de SupabaseService
const mockSupabaseService = {
  client: {
    auth: {
      getUser: jest.fn(),
    },
  },
}

// Mock de ExecutionContext
const mockExecutionContext = {
  switchToHttp: jest.fn().mockReturnThis(),
  getRequest: jest.fn(),
}

describe("AuthGuard", () => {
  let guard: AuthGuard

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        {
          provide: SupabaseService,
          useValue: mockSupabaseService,
        },
      ],
    }).compile()

    guard = module.get<AuthGuard>(AuthGuard)
  })

  it("should be defined", () => {
    expect(guard).toBeDefined()
  })

  it("should throw UnauthorizedException when no authorization header", async () => {
    mockExecutionContext.getRequest.mockReturnValue({
      headers: {},
    })

    await expect(guard.canActivate(mockExecutionContext as unknown as ExecutionContext)).rejects.toThrow(
      UnauthorizedException,
    )
  })

  it("should throw UnauthorizedException when no token", async () => {
    mockExecutionContext.getRequest.mockReturnValue({
      headers: {
        authorization: "Bearer ",
      },
    })

    await expect(guard.canActivate(mockExecutionContext as unknown as ExecutionContext)).rejects.toThrow(
      UnauthorizedException,
    )
  })

  it("should throw UnauthorizedException when invalid token", async () => {
    mockExecutionContext.getRequest.mockReturnValue({
      headers: {
        authorization: "Bearer invalid-token",
      },
    })

    mockSupabaseService.client.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: { message: "Invalid token" },
    })

    await expect(guard.canActivate(mockExecutionContext as unknown as ExecutionContext)).rejects.toThrow(
      UnauthorizedException,
    )
  })

  it("should return true and attach user to request when valid token", async () => {
    const mockRequest = {
      headers: {
        authorization: "Bearer valid-token",
      },
    }

    mockExecutionContext.getRequest.mockReturnValue(mockRequest)

    mockSupabaseService.client.auth.getUser.mockResolvedValue({
      data: { user: { id: "user-id", email: "user@example.com" } },
      error: null,
    })

    expect(await guard.canActivate(mockExecutionContext as unknown as ExecutionContext)).toBe(true)
    expect(mockRequest.user).toEqual({ id: "user-id", email: "user@example.com" })
  })
})

