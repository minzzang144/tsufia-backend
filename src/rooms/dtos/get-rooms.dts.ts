import { CoreOutput } from '@common/dtos/core.dto';
import { Room } from '@rooms/entities/room.entity';

export class GetRoomsOutputDto extends CoreOutput {
  rooms?: Room[];
}
