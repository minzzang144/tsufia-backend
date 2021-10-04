import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateChatInputDto, CreateChatOutputDto } from '@chats/dtos/create-chat.dto';
import { Chat } from '@chats/entities/chat.entity';
import { RequestWithUser } from '@common/common.interface';
import { Room } from '@rooms/entities/room.entity';
import { User } from '@users/entities/user.entity';
import { GetChatsOutputDto } from '@chats/dtos/get-chats.dto';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(Chat) private readonly chatRepository: Repository<Chat>,
    @InjectRepository(Room) private readonly roomRepository: Repository<Room>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  private authUser(requestWithUser: RequestWithUser) {
    // 사용자 인증 상태 확인
    const {
      user: { id },
    } = requestWithUser;
    if (!id) return { ok: false, error: '접근 권한을 가지고 있지 않습니다' };
    return { id: +id };
  }

  /* Create Chat Service */
  async createChat(
    requestWithUser: RequestWithUser,
    createChatInputDto: CreateChatInputDto,
  ): Promise<CreateChatOutputDto> {
    try {
      const { ok, error, id } = this.authUser(requestWithUser);
      if (ok === false && error) return { ok, error };

      const { content } = createChatInputDto;
      const createChat = this.chatRepository.create({ content });

      const user = await this.userRepository.findOneOrFail({ id });
      if (!user) return { ok: false, error: '사용자를 찾을 수 없습니다' };
      createChat.user = user;

      const room = await this.roomRepository.findOneOrFail({ id: user.roomId }, { relations: ['game'] });
      if (!room) return { ok: false, error: '사용자가 소속된 방을 찾을 수 없습니다' };
      createChat.cycle = room.game?.cycle;
      createChat.room = room;
      const chat = await this.chatRepository.save(createChat);

      return { ok: true, chat };
    } catch (error) {
      console.log(error);
      return { ok: false, error: '채팅을 생성하는데 실패하였습니다' };
    }
  }

  /* Get Chats Service */
  async getChats(requestWithUser: RequestWithUser): Promise<GetChatsOutputDto> {
    try {
      const { ok, error, id } = this.authUser(requestWithUser);
      if (ok === false && error) return { ok, error };

      const user = await this.userRepository.findOneOrFail({ id }, { select: ['id', 'roomId'] });
      if (!user) return { ok: false, error: '사용자를 찾을 수 없습니다' };

      const room = await this.roomRepository.findOneOrFail(
        { id: user.roomId },
        { select: ['id'], relations: ['chatList', 'chatList.user'] },
      );
      if (!room) return { ok: false, error: '사용자가 소속된 방을 찾을 수 없습니다' };

      return { ok: true, chats: room.chatList };
    } catch (error) {
      console.log(error);
      return { ok: false, error: '채팅 내역을 가져올 수 없습니다' };
    }
  }
}
