import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Game } from '@games/entities/game.entity';
import { Room } from '@rooms/entities/room.entity';
import { User } from '@users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Game, Room, User])],
})
export class GamesModule {}
