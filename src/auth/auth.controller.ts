/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';

import { AuthService } from '@auth/auth.service';
import { KakaoRequest, RequestWithUser } from '@auth/auth.interface';
import { GoogleLoginAuthInputDto, GoogleLoginAuthOutputDto } from '@auth/dtos/google-login-auth.dto';
import { LoginAuthOutputDto } from '@auth/dtos/login-auth.dto';
import { KakaoLoginAuthOutputDto } from '@auth/dtos/kakao-login-auth.dto';
import { KakaoAuthGuard } from '@auth/guards/kakao-auth.guard';
import { LocalAuthGuard } from '@auth/guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /* Post Login Controller */
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: RequestWithUser, @Res({ passthrough: true }) res: Response): Promise<LoginAuthOutputDto> {
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
    @Body() googleLoginAuthInputDto: GoogleLoginAuthInputDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<GoogleLoginAuthOutputDto> {
    return this.authService.googleLogin(res, googleLoginAuthInputDto);
  }
}

@Controller('kakao')
export class KakaoController {
  constructor(private readonly authService: AuthService) {}

  /* Get Kakao Auth */
  @Get()
  @UseGuards(KakaoAuthGuard)
  async kakaoAuth(@Req() req: Request) {}

  /* Get Kakao Auth Callback */
  @Get('callback')
  @UseGuards(KakaoAuthGuard)
  async kakaoAuthCallback(
    @Req() req: KakaoRequest,
    @Res({ passthrough: true }) res: Response,
  ): Promise<KakaoLoginAuthOutputDto> {
    return this.authService.kakaoLogin(req, res);
  }
}
