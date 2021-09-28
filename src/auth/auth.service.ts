import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

import { GoogleLoginAuthInputDto, GoogleLoginAuthOutputDto } from '@auth/dtos/google-login-auth.dto';
import { KakaoLoginAuthInputDto, KakaoLoginAuthOutputDto } from '@auth/dtos/kakao-login-auth.dto';
import { LoginAuthInputDto, LoginAuthOutputDto } from '@auth/dtos/login-auth.dto';
import { LogoutAuthOutputDto } from '@auth/dtos/logout.dto';
import { SilentRefreshAuthOutputDto } from '@auth/dtos/silent-refresh-auth.dto';
import { ValidateAuthInputDto, ValidateAuthOutputDto } from '@auth/dtos/validate-auth.dto';
import { RequestWithUser } from '@common/common.interface';
import { UsersService } from '@users/users.service';
import { Provider } from '@users/entities/user.entity';
import { UserRepository } from '@users/repositories/user.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly usersService: UsersService,
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

      // 로그인 상태 확인
      if (ok === false) return { ok: false, error };
      if (data == null) return { ok: false, error: '토큰을 발급 받을 수 없습니다.' };

      // refreshToken & accessToken 발급
      const { id } = data;
      const payload = { id };
      const accessToken = jwt.sign(payload, this.configService.get('JWT_ACCESS_TOKEN_SECRET_KEY'), {
        expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
      });
      const refreshToken = jwt.sign({}, this.configService.get('JWT_REFRESH_TOKEN_SECRET_KEY'), {
        expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
        audience: String(id),
      });

      /* refreshToken 필드 업데이트 */
      const loginUser = await this.userRepository.findOneOrFail(id);
      loginUser.refreshToken = refreshToken;
      await this.userRepository.save(loginUser);

      // 쿠키 설정
      res.cookie('refreshToken', refreshToken, {
        expires: new Date(Date.now() + this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')),
        httpOnly: true,
      });
      return {
        ok: true,
        accessToken,
      };
    } catch (error) {
      return { ok: false, error: '로그인 인증에 실패하였습니다.' };
    }
  }

  /* Logout Service */
  async logout(requestWithUser: RequestWithUser, res: Response): Promise<LogoutAuthOutputDto> {
    try {
      const {
        user: { id },
      } = requestWithUser;
      if (!id) return { ok: false, error: '접근 권한을 가지고 있지 않습니다' };

      const loginUser = await this.userRepository.findOneOrFail(id);
      loginUser.refreshToken = null;
      await this.userRepository.save(loginUser);

      res.clearCookie('refreshToken');
      return { ok: true };
    } catch (error) {
      console.log(error);
      return { ok: false, error: '로그아웃을 실패하였습니다' };
    }
  }

  /* Silent Refresh Service */
  async silentRefresh(req: Request, res: Response): Promise<SilentRefreshAuthOutputDto> {
    try {
      // refreshToken 유효성 검사
      const getRefreshToken = req.cookies['refreshToken'];
      if (!getRefreshToken) return { ok: false };
      let userId: string | string[] | null;
      jwt.verify(
        getRefreshToken,
        this.configService.get('JWT_REFRESH_TOKEN_SECRET_KEY'),
        (err: jwt.VerifyErrors | null, decoded: jwt.JwtPayload | undefined) => {
          if (err) throw new UnauthorizedException();
          userId = decoded.aud;
        },
      );
      const loginUser = await this.userRepository.findOneOrFail(+userId);
      if (loginUser.refreshToken !== getRefreshToken) {
        res.clearCookie('refreshToken');
        await this.userRepository.save(loginUser);
        return { ok: false, error: '잘못된 접근입니다.' };
      }

      // refreshToken & accessToken 재발급
      const payload = { id: userId };
      const accessToken = jwt.sign(payload, this.configService.get('JWT_ACCESS_TOKEN_SECRET_KEY'), {
        expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
      });
      const refreshToken = jwt.sign({}, this.configService.get('JWT_REFRESH_TOKEN_SECRET_KEY'), {
        expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
        audience: String(userId),
      });

      /* refreshToken 필드 업데이트 */
      loginUser.refreshToken = refreshToken;
      await this.userRepository.save(loginUser);

      // 쿠키 설정
      res.cookie('refreshToken', refreshToken, {
        expires: new Date(Date.now() + this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')),
        httpOnly: true,
      });
      return {
        ok: true,
        accessToken,
      };
    } catch (error) {
      return { ok: false, error: '로그인 연장에 실패하였습니다.' };
    }
  }

  /* Google Login */
  async googleLogin(
    res: Response,
    googleLoginAuthInputDto: GoogleLoginAuthInputDto,
  ): Promise<GoogleLoginAuthOutputDto> {
    try {
      const { email, firstName, lastName, photo } = googleLoginAuthInputDto;

      // 유저 중복 검사
      const findUser = await this.userRepository.findOneOrCreate(
        { email },
        { email, firstName, lastName, photo, provider: Provider.Google },
      );
      if (findUser && findUser.provider !== Provider.Google) {
        return { ok: false, error: '현재 계정으로 가입한 이메일이 존재합니다.' };
      }

      // 구글 가입이 되어 있는 경우 accessToken 및 refreshToken 발급
      const findUserPayload = { id: findUser.id };
      const accessToken = jwt.sign(findUserPayload, this.configService.get('JWT_ACCESS_TOKEN_SECRET_KEY'), {
        expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
      });
      const refreshToken = jwt.sign({}, this.configService.get('JWT_REFRESH_TOKEN_SECRET_KEY'), {
        expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
        audience: String(findUser.id),
      });

      /* refreshToken 필드 업데이트 */
      findUser.refreshToken = refreshToken;
      await this.userRepository.save(findUser);

      // 쿠키 설정
      res.cookie('refreshToken', refreshToken, {
        expires: new Date(Date.now() + this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')),
        httpOnly: true,
      });
      return {
        ok: true,
        accessToken,
      };
    } catch (error) {
      return { ok: false, error: '구글 로그인 인증을 실패 하였습니다.' };
    }
  }

  async kakaoLogin(res: Response, kakaoLoginAuthInputDto: KakaoLoginAuthInputDto): Promise<KakaoLoginAuthOutputDto> {
    try {
      const { email, nickname, photo } = kakaoLoginAuthInputDto;

      // 유저 중복 검사
      const findUser = await this.userRepository.findOneOrCreate(
        { email },
        { email, nickname, photo, provider: Provider.Kakao },
      );
      if (findUser && findUser.provider !== Provider.Kakao) {
        return { ok: false, error: '현재 계정으로 가입한 이메일이 존재합니다.' };
      }

      // 카카오 가입이 되어 있는 경우 accessToken 및 refreshToken 발급
      const findUserPayload = { id: findUser.id };
      const accessToken = jwt.sign(findUserPayload, this.configService.get('JWT_ACCESS_TOKEN_SECRET_KEY'), {
        expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
      });
      const refreshToken = jwt.sign({}, this.configService.get('JWT_REFRESH_TOKEN_SECRET_KEY'), {
        expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
        audience: String(findUser.id),
      });

      /* refreshToken 필드 업데이트 */
      findUser.refreshToken = refreshToken;
      await this.userRepository.save(findUser);

      // 쿠키 설정
      res.cookie('refreshToken', refreshToken, {
        expires: new Date(Date.now() + this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')),
        httpOnly: true,
      });
      return {
        ok: true,
        accessToken,
      };
    } catch (error) {
      return { ok: false, error: '구글 로그인 인증을 실패 하였습니다.' };
    }
  }
}
