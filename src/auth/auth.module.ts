import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from '@auth/auth.controller';
import { AuthService } from '@auth/auth.service';
import { LocalStrategy } from '@auth/strategies/local.strategy';
import { UsersModule } from '@users/users.module';

@Module({
  imports: [UsersModule, PassportModule],
  providers: [AuthService, LocalStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
