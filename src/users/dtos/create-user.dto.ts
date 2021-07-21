import { PickType } from '@nestjs/mapped-types';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { User } from '@users/entities/user.entity';

export class CreateUserInputDto extends PickType(User, ['email', 'firstName', 'lastName', 'password']) {
  @IsString()
  checkPassword: string;
}

export class CreateUserOutputDto {
  @IsBoolean()
  @IsNotEmpty()
  ok: boolean;

  @IsString()
  @IsOptional()
  error?: string;
}
