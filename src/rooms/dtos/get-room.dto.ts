import { CoreOutput } from '@common/dtos/core.dto';
import { Room } from '@rooms/entities/room.entity';

export class GetRoomOutputDto extends CoreOutput {
  room?: Room;
}
