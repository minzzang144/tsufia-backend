import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

import { ValidateAuthInputDto, ValidateAuthOutputDto } from '@auth/dtos/validate-auth.dto';
import { UsersService } from '@users/users.service';
import { LoginAuthInputDto, LoginAuthOutputDto } from '@auth/dtos/login-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /* Validate User Service */
  async validateUser(validateAuthInputDto: ValidateAuthInputDto): Promise<ValidateAuthOutputDto> {
    try {
      const { email, password } = validateAuthInputDto;
      const { user } = await this.usersService.getUser({ email });
      if (!user) return { ok: false, error: '존재하지 않는 이메일 계정입니다.' };
      if (user && (await user.validatePassword(password)) === false) {
        return { ok: false, error: '패스워드가 일치하지 않습니다.' };
      }
      return { ok: true, data: user };
    } catch (error) {
      return { ok: false, error: '로그인 인증에 실패하였습니다.' };
    }
  }

  /* Login Service */
  async login(res: Response, loginAuthInputDto: LoginAuthInputDto): Promise<LoginAuthOutputDto> {
    try {
      const { ok, error, data } = loginAuthInputDto;
      if (ok === false) return { ok: false, error };
      if (data == null) return { ok: false, error: '토큰을 발급 받을 수 없습니다.' };
      const { id } = data;
      const payload = { id };
      const refreshToken = this.jwtService.sign(payload, {
        secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET_KEY'),
        expiresIn: +this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
      });
      res.cookie('refreshToken', refreshToken, {
        expires: new Date(Date.now() + +this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')),
        httpOnly: true,
      });
      return {
        ok: true,
        accessToken: this.jwtService.sign(payload, {
          secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET_KEY'),
          expiresIn: +this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
        }),
      };
    } catch (error) {
      console.log(error);
      return { ok: false, error: '로그인 인증에 실패하였습니다.' };
    }
  }
}
