import { CoreOutput } from '@common/dtos/core.dto';
import { IsOptional, IsString } from 'class-validator';

export class SilentRefreshAuthOutputDto extends CoreOutput {
  @IsOptional()
  @IsString()
  accessToken?: string;
}
