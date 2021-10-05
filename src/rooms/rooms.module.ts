import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RoomsAPIController, RoomsController } from '@rooms/rooms.controller';
import { RoomsGateway } from '@rooms/rooms.gateway';
import { RoomsService } from '@rooms/rooms.service';
import { Game } from '@games/entities/game.entity';
import { Room } from '@rooms/entities/room.entity';
import { User } from '@users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Room, User, Game])],
  controllers: [RoomsController, RoomsAPIController],
  providers: [RoomsGateway, RoomsService],
})
export class RoomsModule {}
