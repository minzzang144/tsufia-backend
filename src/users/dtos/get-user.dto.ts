import { CoreOutput } from '@common/dtos/core.dto';
import { PartialType, PickType } from '@nestjs/mapped-types';

import { User } from '@users/entities/user.entity';
import { IsOptional } from 'class-validator';

export class GetUserInputDto extends PartialType(PickType(User, ['id', 'email'])) {}

export class GetUserOutputDto extends CoreOutput {
  @IsOptional()
  user?: User;
}
