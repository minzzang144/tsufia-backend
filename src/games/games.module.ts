import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Game } from '@games/entities/game.entity';
import { GamesController } from '@games/games.controller';
import { GamesService } from '@games/games.service';
import { Room } from '@rooms/entities/room.entity';
import { User } from '@users/entities/user.entity';
import { GamesGateway } from '@games/games.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Game, Room, User])],
  controllers: [GamesController],
  providers: [GamesService, GamesGateway],
})
export class GamesModule {}
