import { PickType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';

import { CoreOutput } from '@common/dtos/core.dto';
import { User } from '@users/entities/user.entity';

export class GoogleLoginAuthInputDto extends PickType(User, ['email', 'firstName', 'lastName', 'photo']) {}

export class GoogleLoginAuthOutputDto extends CoreOutput {
  @IsOptional()
  @IsString()
  accessToken?: string;
}
