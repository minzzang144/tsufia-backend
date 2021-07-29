import { IsOptional, IsString } from 'class-validator';

import { CoreOutput } from '@common/dtos/core.dto';
import { User } from '@users/entities/user.entity';

export class LoginAuthInputDto extends CoreOutput {
  @IsOptional()
  @IsString()
  data?: User;
}

export class LoginAuthOutputDto extends CoreOutput {
  @IsOptional()
  @IsString()
  accessToken?: string;
}
