import { CoreOutput } from '@common/dtos/core.dto';
import { PickType } from '@nestjs/mapped-types';
import { Room } from '@rooms/entities/room.entity';

export class CreateRoomInputDto extends PickType(Room, ['title', 'totalHeadCount']) {}

export class CreateRoomOutputDto extends CoreOutput {
  room?: Room;
}
