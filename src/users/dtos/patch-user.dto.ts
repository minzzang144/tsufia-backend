import { CoreOutput } from '@common/dtos/core.dto';
import { PartialType, PickType } from '@nestjs/mapped-types';
import { User } from '@users/entities/user.entity';
import { IsOptional, IsString } from 'class-validator';

export class PatchUserInputDto extends PartialType(PickType(User, ['firstName', 'lastName', 'password'])) {
  @IsOptional()
  @IsString()
  checkPassword?: string;
}

export class PatchUserOutputDto extends CoreOutput {}
