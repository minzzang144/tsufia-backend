import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { ValidateAuthInputDto, ValidateAuthOutputDto } from '@auth/dtos/validate-auth.dto';
import { UsersService } from '@users/users.service';
import { LoginAuthInputDto, LoginAuthOutputDto } from '@auth/dtos/login-auth.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService) {}

  /* Validate User Service */
  async validateUser(validateAuthInputDto: ValidateAuthInputDto): Promise<ValidateAuthOutputDto> {
    try {
      const { email, password } = validateAuthInputDto;
      const { user } = await this.usersService.findOneUser({ email });
      if (!user) return { ok: false, error: '이메일 계정이 존재하지 않습니다.' };
      if (user && (await user.validatePassword(password))) {
        return { ok: false, error: '패스워드가 일치하지 않습니다.' };
      }
      return { ok: true, data: user };
    } catch (error) {
      return { ok: false, error: '로그인 인증에 실패하였습니다.' };
    }
  }

  /* Login Service */
  async login(loginAuthInputDto: LoginAuthInputDto): Promise<LoginAuthOutputDto> {
    if (loginAuthInputDto == null) return { ok: false, error: '토큰을 발급받을 수 없습니다.' };
    const { id, email, firstName, lastName } = loginAuthInputDto;
    const payload = { id, email, firstName, lastName };
    return {
      ok: true,
      access_token: this.jwtService.sign(payload),
    };
  }
}
