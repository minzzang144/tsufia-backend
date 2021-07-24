import { CoreOutput } from '@common/dtos/core.dto';
import { PickType } from '@nestjs/mapped-types';
import { User } from '@users/entities/user.entity';

export class PostUserPasswordInputDto extends PickType(User, ['password']) {}

export class PostUserPasswordOutputDto extends CoreOutput {}
