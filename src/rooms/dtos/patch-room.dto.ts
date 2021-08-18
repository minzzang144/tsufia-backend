import { CoreOutput } from '@common/dtos/core.dto';
import { PartialType, PickType } from '@nestjs/mapped-types';
import { Room } from '@rooms/entities/room.entity';

export class PatchRoomInputDto extends PartialType(PickType(Room, ['title', 'totalHeadCount'])) {}

export class PatchRoomOutputDto extends CoreOutput {
  room?: Room;
}
