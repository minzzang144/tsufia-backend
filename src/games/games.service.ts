import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as moment from 'moment';

import { RequestWithUser } from '@common/common.interface';
import { CreateGameOutputDto } from '@games/dtos/create-game.dto';
import { GetGameOutputDto } from '@games/dtos/get-game.dto';
import { Circle, Game } from '@games/entities/game.entity';
import { Room, Status } from '@rooms/entities/room.entity';
import { User } from '@users/entities/user.entity';
import { PatchGameInputDto, PatchGameOutputDto } from '@games/dtos/patch-game.dto';

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Game) private readonly gameRepository: Repository<Game>,
    @InjectRepository(Room) private readonly roomRepository: Repository<Room>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  private authUser(requestWithUser: RequestWithUser) {
    // 사용자 인증 상태 확인
    const {
      user: { id },
    } = requestWithUser;
    if (!id) return { ok: false, error: '사용자를 찾을 수 없습니다' };
    return { id };
  }

  /* Create Game Service */
  async createGame(requestWithUser: RequestWithUser): Promise<CreateGameOutputDto> {
    try {
      const { ok, error, id } = this.authUser(requestWithUser);
      if (ok === false && error) return { ok, error };

      const user = await this.userRepository.findOneOrFail({ id });
      if (!user.roomId) return { ok: false, error: '사용자가 소속된 방을 찾을 수 없습니다' };

      const room = await this.roomRepository.findOneOrFail({ id: user.roomId });

      const countDown = moment().add(10, 'seconds').unix();
      const newGame = this.gameRepository.create({ countDown });
      room.status = Status.진행중;
      newGame.room = room;
      newGame.user = user;
      const game = await this.gameRepository.save(newGame);
      await this.roomRepository.save(room);
      return { ok: true, game };
    } catch (error) {
      console.log(error);
      return { ok: false, error: '게임을 생성할 수 없습니다' };
    }
  }

  /* Get Game Servecie */
  async getGame(requestWithUser: RequestWithUser, id: string): Promise<GetGameOutputDto> {
    try {
      const { ok, error } = this.authUser(requestWithUser);
      if (ok === false && error) return { ok, error };

      const game = await this.gameRepository.findOneOrFail(
        { id: +id },
        { select: ['id', 'userId', 'roomId', 'circle', 'countDown'] },
      );
      if (!game) return { ok: false, error: '게임을 찾을 수 없습니다' };

      return { ok: true, game };
    } catch (error) {
      if (error.name === 'EntityNotFound') {
        return { ok: false };
      }
      console.log(error);
      return { ok: false, error: '게임을 불러올 수 없습니다' };
    }
  }

  /* Patch Game Service */
  async patchGame(requestWithUser: RequestWithUser, patchGameInputDto: PatchGameInputDto): Promise<PatchGameOutputDto> {
    try {
      const { ok, error } = this.authUser(requestWithUser);
      if (ok === false && error) return { ok, error };

      const { roomId } = patchGameInputDto;
      let game = await this.gameRepository.findOneOrFail(
        { roomId: +roomId },
        { select: ['id', 'userId', 'roomId', 'circle', 'countDown'] },
      );
      if (!game) return { ok: false, error: '게임을 찾을 수 없습니다' };

      let countDown: number;
      switch (game.circle) {
        case null:
          countDown = moment().add(15, 'seconds').unix();
          game.countDown = countDown;
          game.circle = Circle.밤;
          game = await this.gameRepository.save(game);
          return { ok: true, game };
        case Circle.밤:
          countDown = moment().add(30, 'seconds').unix();
          game.countDown = countDown;
          game.circle = Circle.낮;
          game = await this.gameRepository.save(game);
          return { ok: true, game };
        case Circle.낮:
          countDown = moment().add(15, 'seconds').unix();
          game.countDown = countDown;
          game.circle = Circle.저녁;
          game = await this.gameRepository.save(game);
          return { ok: true, game };
        case Circle.저녁:
          countDown = moment().add(15, 'seconds').unix();
          game.countDown = countDown;
          game.circle = Circle.밤;
          game = await this.gameRepository.save(game);
          return { ok: true, game };
        default:
          break;
      }
    } catch (error) {
      console.log(error);
      return { ok: false, error: '게임을 업데이트 할 수 없습니다' };
    }
  }
}
