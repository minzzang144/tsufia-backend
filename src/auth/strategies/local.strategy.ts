import { AuthService } from '@auth/auth.service';
import { ValidateAuthInputDto, ValidateAuthOutputDto } from '@auth/dtos/validate-auth.dto';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport';

export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(validateAuthInputDto: ValidateAuthInputDto): Promise<ValidateAuthOutputDto> {
    try {
      const { email, password } = validateAuthInputDto;
      const { user } = await this.authService.validateUser({ email, password });
      if (!user) {
        return { ok: false, error: '로그인 인증에 실패하였습니다.' };
      }
      return { ok: true, user };
    } catch (error) {
      console.log(error);
      return { ok: false, error: '로그인 인증에 실패하였습니다.' };
    }
  }
}
