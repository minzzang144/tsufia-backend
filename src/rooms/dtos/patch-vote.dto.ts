import { CoreOutput } from '@common/dtos/core.dto';
import { Room } from '@rooms/entities/room.entity';
import { IsOptional } from 'class-validator';

export class PatchVoteOutputDto extends CoreOutput {
  @IsOptional()
  room?: Room;
}
