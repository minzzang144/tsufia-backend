import { CoreOutput } from '@common/dtos/core.dto';
import { PickType } from '@nestjs/mapped-types';
import { User } from '@users/entities/user.entity';
import { IsOptional, IsString } from 'class-validator';

export class KakaoLoginAuthInputDto extends PickType(User, ['email', 'nickname', 'photo']) {}

export class KakaoLoginAuthOutputDto extends CoreOutput {
  @IsOptional()
  @IsString()
  accessToken?: string;
}
