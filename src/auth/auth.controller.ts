import { Controller, Post, Request, UseGuards } from '@nestjs/common';

import { AuthService } from '@auth/auth.service';
import { LocalAuthGuard } from '@auth/guards/local-auth.guard';
import { LoginAuthOutputDto } from '@auth/dtos/login-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  /* Post Login Controller */
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req): Promise<LoginAuthOutputDto> {
    return this.authService.login(req.user);
  }
}
