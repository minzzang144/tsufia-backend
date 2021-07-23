import { Controller, Post, Req, UseGuards } from '@nestjs/common';

import { AuthService } from '@auth/auth.service';
import { LocalAuthGuard } from '@auth/guards/local-auth.guard';
import { LoginAuthOutputDto } from '@auth/dtos/login-auth.dto';
import { Request } from 'express';
import { ValidateAuthOutputDto } from '@auth/dtos/validate-auth.dto';

export type RequestWithUser = Request & { user: ValidateAuthOutputDto };

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  /* Post Login Controller */
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: RequestWithUser): Promise<LoginAuthOutputDto> {
    return this.authService.login(req.user.data);
  }
}
