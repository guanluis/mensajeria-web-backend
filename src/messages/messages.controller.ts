import { Body, Controller, Get, Param, Post, Query, UseGuards } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from "@nestjs/swagger"
import type { MessagesService } from "./messages.service"
import type { Message } from "./interfaces/message.interface"
import type { CreateMessageDto } from "./dto/create-message.dto"
import { AuthGuard } from "../auth/auth.guard"
import { User } from "../auth/user.decorator"

@ApiTags("messages")
@Controller("messages")
@UseGuards(AuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get(":conversationId")
  @ApiOperation({ summary: "Get messages for a conversation" })
  @ApiQuery({ name: "page", required: false, description: "Page number" })
  @ApiQuery({ name: "limit", required: false, description: "Items per page" })
  @ApiResponse({ status: 200, description: "Return messages for a conversation." })
  @ApiResponse({ status: 404, description: "Conversation not found." })
  async findAll(
    @Param('conversationId') conversationId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 50,
  ): Promise<Message[]> {
    return this.messagesService.findAll(conversationId, +page, +limit)
  }

  @Post()
  @ApiOperation({ summary: "Create a new message" })
  @ApiResponse({ status: 201, description: "The message has been successfully created." })
  @ApiResponse({ status: 404, description: "Conversation not found or user is not a participant." })
  async create(@Body() createMessageDto: CreateMessageDto, @User('id') userId: string): Promise<Message> {
    return this.messagesService.create(createMessageDto, userId)
  }
}

