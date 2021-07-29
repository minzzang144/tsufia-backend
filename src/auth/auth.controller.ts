import { Controller, Post, Req, UseGuards } from '@nestjs/common';

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
  async login(@Req() req: RequestWithUser): Promise<LoginAuthOutputDto> {
    return this.authService.login(req.user);
  }
}
