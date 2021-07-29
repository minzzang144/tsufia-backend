import { Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';

import { AuthService } from '@auth/auth.service';
import { LocalAuthGuard } from '@auth/guards/local-auth.guard';
import { LoginAuthOutputDto } from '@auth/dtos/login-auth.dto';
import { RequestWithUser } from '@auth/auth.interface';

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
