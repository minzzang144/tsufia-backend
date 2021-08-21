import { IsOptional } from 'class-validator';

import { CoreOutput } from '@common/dtos/core.dto';

export class DeleteRoomOutputDto extends CoreOutput {
  @IsOptional()
  roomId?: number;
}
