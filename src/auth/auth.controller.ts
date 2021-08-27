/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';

import { RequestWithUserData } from '@auth/auth.interface';
import { AuthService } from '@auth/auth.service';
import { GoogleLoginAuthInputDto, GoogleLoginAuthOutputDto } from '@auth/dtos/google-login-auth.dto';
import { LoginAuthOutputDto } from '@auth/dtos/login-auth.dto';
import { KakaoLoginAuthInputDto, KakaoLoginAuthOutputDto } from '@auth/dtos/kakao-login-auth.dto';
import { LocalAuthGuard } from '@auth/guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /* Post Login Controller */
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: RequestWithUserData, @Res({ passthrough: true }) res: Response): Promise<LoginAuthOutputDto> {
    return this.authService.login(res, req.user);
  }

  /* Post Silent Refresh Controller */
  @Post('silent-refresh')
  async silentRefresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.authService.silentRefresh(req, res);
  }
}

@Controller('google')
export class GoogleController {
  constructor(private readonly authService: AuthService) {}

  /* Post Google Auth */
  @Post()
  async googleAuth(
    @Res({ passthrough: true }) res: Response,
    @Body() googleLoginAuthInputDto: GoogleLoginAuthInputDto,
  ): Promise<GoogleLoginAuthOutputDto> {
    return this.authService.googleLogin(res, googleLoginAuthInputDto);
  }
}

@Controller('kakao')
export class KakaoController {
  constructor(private readonly authService: AuthService) {}

  /* Post Google Auth */
  @Post()
  async kakaoAuth(
    @Res({ passthrough: true }) res: Response,
    @Body() kakaoLoginAuthInputDto: KakaoLoginAuthInputDto,
  ): Promise<KakaoLoginAuthOutputDto> {
    return this.authService.kakaoLogin(res, kakaoLoginAuthInputDto);
  }
}
