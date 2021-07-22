import { AuthService } from '@auth/auth.service';
import { ValidateAuthOutputDto } from '@auth/dtos/validate-auth.dto';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<ValidateAuthOutputDto> {
    try {
      const { data: user } = await this.authService.validateUser({ email, password });
      if (!user) {
        return { ok: false, error: '로그인 인증에 실패하였습니다.' };
      }
      user.toJSON();
      return { ok: true, data: user };
    } catch (error) {
      console.log(error);
      return { ok: false, error: '로그인 인증에 실패하였습니다.' };
    }
  }
}
