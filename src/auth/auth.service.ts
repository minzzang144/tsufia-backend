import { Injectable } from '@nestjs/common';

import { ValidateAuthInputDto, ValidateAuthOutputDto } from '@auth/dtos/validate-auth.dto';
import { UsersService } from '@users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  /* Validate User */
  async validateUser(validateAuthInputDto: ValidateAuthInputDto): Promise<ValidateAuthOutputDto> {
    try {
      const { email, password } = validateAuthInputDto;
      const { user } = await this.usersService.findOneUser({ email });
      if (!user) return { ok: false, error: '이메일 계정이 존재하지 않습니다.' };
      if (user && user.password !== password) {
        return { ok: false, error: '패스워드가 일치하지 않습니다.' };
      }
      return { ok: true, user };
    } catch (error) {
      return { ok: false, error: '로그인 인증에 실패하였습니다.' };
    }
  }
}
