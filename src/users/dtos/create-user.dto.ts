import { PickType } from '@nestjs/mapped-types';
import { IsString } from 'class-validator';

import { User } from '@users/entities/user.entity';
import { CoreOutput } from '@common/dtos/core.dto';

export class CreateUserInputDto extends PickType(User, ['email', 'firstName', 'lastName', 'password']) {
  @IsString()
  checkPassword: string;
}

export class CreateUserOutputDto extends CoreOutput {}
