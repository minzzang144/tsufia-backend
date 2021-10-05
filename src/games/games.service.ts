import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as moment from 'moment';

import { RequestWithUser } from '@common/common.interface';
import { CreateGameOutputDto } from '@games/dtos/create-game.dto';
import { Cycle, Game } from '@games/entities/game.entity';
import { Room } from '@rooms/entities/room.entity';
import { User } from '@users/entities/user.entity';
import { PatchGameOutputDto } from '@games/dtos/patch-game.dto';

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
    return { id: +id };
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
      newGame.room = room;
      const game = await this.gameRepository.save(newGame);
      await this.roomRepository.save(room);
      return { ok: true, game };
    } catch (error) {
      console.log(error);
      return { ok: false, error: '게임을 생성할 수 없습니다' };
    }
  }

  /* Patch Game Service */
  async patchGame(requestWithUser: RequestWithUser, id: string): Promise<PatchGameOutputDto> {
    try {
      const { ok, error } = this.authUser(requestWithUser);
      if (ok === false && error) return { ok, error };

      let game = await this.gameRepository.findOneOrFail(
        { id: +id },
        { select: ['id', 'roomId', 'cycle', 'countDown'] },
      );
      if (!game) return { ok: false, error: '게임을 찾을 수 없습니다' };

      let countDown: number;
      switch (game.cycle) {
        case null:
          countDown = moment().add(15, 'seconds').unix();
          game.countDown = countDown;
          game.cycle = Cycle.밤;
          game = await this.gameRepository.save(game);
          return { ok: true, game };
        case Cycle.밤:
          countDown = moment().add(30, 'seconds').unix();
          game.countDown = countDown;
          game.cycle = Cycle.낮;
          game = await this.gameRepository.save(game);
          return { ok: true, game };
        case Cycle.낮:
          countDown = moment().add(15, 'seconds').unix();
          game.countDown = countDown;
          game.cycle = Cycle.저녁;
          game = await this.gameRepository.save(game);
          return { ok: true, game };
        case Cycle.저녁:
          countDown = moment().add(15, 'seconds').unix();
          game.countDown = countDown;
          game.cycle = Cycle.밤;
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
