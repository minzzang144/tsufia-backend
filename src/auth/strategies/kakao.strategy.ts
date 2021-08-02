import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-kakao';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get('KAKAO_CLIENT_ID'),
      clientSecret: '',
      callbackURL: 'http://localhost:4000/kakao/callback',
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (error: any, user?: any, info?: any) => void,
  ) {
    try {
      console.log(profile);
      const user = {
        id: profile.id,
      };
      done(null, user);
    } catch (error) {
      done(error);
    }
  }
}
