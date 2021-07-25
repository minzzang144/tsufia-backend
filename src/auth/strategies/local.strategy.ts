import { AuthService } from '@auth/auth.service';
import { ValidateAuthOutputDto } from '@auth/dtos/validate-auth.dto';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@users/entities/user.entity';
import { plainToClass } from 'class-transformer';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<ValidateAuthOutputDto> {
    try {
      const result = await this.authService.validateUser({ email, password });
      const { ok, error } = result;
      let { data: user } = result;
      if (ok === false) return { ok: false, error };
      if (!user) {
        return { ok: false, error: '로그인 인증에 실패하였습니다.' };
      }
      const plainUser = user.toJSON();
      user = plainToClass(User, plainUser);
      return { ok: true, data: user };
    } catch (error) {
      console.log(error);
      return { ok: false, error: '로그인 인증에 실패하였습니다.' };
    }
  }
}
