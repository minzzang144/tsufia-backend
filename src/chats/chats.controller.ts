import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { RequestWithUser } from '@common/common.interface';
import { ChatsService } from '@chats/chats.service';
import { CreateChatInputDto, CreateChatOutputDto } from '@chats/dtos/create-chat.dto';

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createChat(
    @Req() requestWithUser: RequestWithUser,
    @Body() createChatInputDto: CreateChatInputDto,
  ): Promise<CreateChatOutputDto> {
    return this.chatsService.createChat(requestWithUser, createChatInputDto);
  }
}
