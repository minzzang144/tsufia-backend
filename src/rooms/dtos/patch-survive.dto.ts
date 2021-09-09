import { CoreOutput } from '@common/dtos/core.dto';
import { Room } from '@rooms/entities/room.entity';
import { IsNumber, IsOptional } from 'class-validator';

export class PatchSurviveInputDto {
  @IsOptional()
  @IsNumber()
  selectId?: number;
}

export class PatchSurviveOutputDto extends CoreOutput {
  @IsOptional()
  room?: Room;
}
