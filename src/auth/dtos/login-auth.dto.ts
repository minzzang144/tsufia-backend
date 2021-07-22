import { ValidateAuthOutputDto } from '@auth/dtos/validate-auth.dto';
import { IsString } from 'class-validator';

export class LoginAuthInputDto extends ValidateAuthOutputDto {}

export class LoginAuthOutputDto extends ValidateAuthOutputDto {
  @IsString()
  access_token: string;
}
