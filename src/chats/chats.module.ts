import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ChatsController } from '@chats/chats.controller';
import { ChatsService } from '@chats/chats.service';
import { Chat } from '@chats/entities/chat.entity';
import { Room } from '@rooms/entities/room.entity';
import { User } from '@users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Chat, Room, User])],
  controllers: [ChatsController],
  providers: [ChatsService],
})
export class ChatsModule {}
