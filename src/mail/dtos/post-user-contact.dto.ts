import { CoreOutput } from '@common/dtos/core.dto';
import { IsString } from 'class-validator';

export class PostUserContactInputDto {
  @IsString()
  email: string;

  @IsString()
  subject: string;

  @IsString()
  message: string;
}

export class PostUserContactOutputDto extends CoreOutput {}
