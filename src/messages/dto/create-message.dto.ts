import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"

export class CreateMessageDto {
  @ApiProperty({ description: "The ID of the conversation" })
  @IsNotEmpty()
  @IsUUID()
  conversationId: string

  @ApiPropertyOptional({ description: "The content of the message" })
  @IsOptional()
  @IsString()
  content?: string

  @ApiPropertyOptional({ description: "The URL of the image" })
  @IsOptional()
  @IsString()
  imageUrl?: string
}

