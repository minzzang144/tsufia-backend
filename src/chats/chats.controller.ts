import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { RequestWithUser } from '@common/common.interface';
import { ChatsService } from '@chats/chats.service';
import { CreateChatInputDto, CreateChatOutputDto } from '@chats/dtos/create-chat.dto';

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  /* Create Chats Controller */
  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createChat(
    @Req() requestWithUser: RequestWithUser,
    @Body() createChatInputDto: CreateChatInputDto,
  ): Promise<CreateChatOutputDto> {
    return this.chatsService.createChat(requestWithUser, createChatInputDto);
  }

  /* Get Chats Controller */
  @UseGuards(JwtAuthGuard)
  @Get()
  async getChats(@Req() requestWithUser: RequestWithUser): Promise<CreateChatOutputDto> {
    return this.chatsService.getChats(requestWithUser);
  }
}
