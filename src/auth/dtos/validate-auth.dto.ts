import { CoreOutput } from '@common/dtos/core.dto';
import { PickType } from '@nestjs/mapped-types';
import { User } from '@users/entities/user.entity';
import { IsOptional } from 'class-validator';

export class ValidateAuthInputDto extends PickType(User, ['email', 'password']) {}

export class ValidateAuthOutputDto extends CoreOutput {
  @IsOptional()
  data?: User;
}
