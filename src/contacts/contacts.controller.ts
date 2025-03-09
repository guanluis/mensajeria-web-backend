import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from "@nestjs/swagger"
import type { ContactsService } from "./contacts.service"
import type { Contact } from "./interfaces/contact.interface"
import { AuthGuard } from "../auth/auth.guard"
import { User } from "../auth/user.decorator"

@ApiTags("contacts")
@Controller("contacts")
@UseGuards(AuthGuard)
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all contacts' })
  @ApiResponse({ status: 200, description: 'Return all contacts.' })
  async findAll(@User('id') userId: string): Promise<Contact[]> {
    return this.contactsService.findAll(userId);
  }

  @Get("search")
  @ApiOperation({ summary: "Search contacts" })
  @ApiQuery({ name: "q", required: true, description: "Search query" })
  @ApiResponse({ status: 200, description: "Return matching contacts." })
  async search(@Query('q') query: string, @User('id') userId: string): Promise<Contact[]> {
    return this.contactsService.search(query, userId)
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a contact by ID" })
  @ApiResponse({ status: 200, description: "Return a contact by ID." })
  @ApiResponse({ status: 404, description: "Contact not found." })
  async findOne(@Param('id') id: string, @User('id') userId: string): Promise<Contact> {
    return this.contactsService.findOne(id, userId)
  }
}

