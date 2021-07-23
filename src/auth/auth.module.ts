import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { jwtConstants } from '@auth/auth.contants';
import { AuthController } from '@auth/auth.controller';
import { AuthService } from '@auth/auth.service';
import { LocalStrategy } from '@auth/strategies/local.strategy';
import { UsersModule } from '@users/users.module';
import { JwtStrategy } from '@auth/strategies/jwt.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({ secret: jwtConstants.secret, signOptions: { expiresIn: 3600 } }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
