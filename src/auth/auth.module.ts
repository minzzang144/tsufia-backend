import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthController, GoogleController, KakaoController } from '@auth/auth.controller';
import { AuthService } from '@auth/auth.service';
import { GoogleStrategy } from '@auth/strategies/google.strategy';
import { JwtStrategy } from '@auth/strategies/jwt.strategy';
import { KakaoStrategy } from '@auth/strategies/kakao.strategy';
import { LocalStrategy } from '@auth/strategies/local.strategy';
import { UsersModule } from '@users/users.module';
import { UserRepository } from '@users/repositories/user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository]), UsersModule, PassportModule],
  providers: [AuthService, LocalStrategy, JwtStrategy, GoogleStrategy, KakaoStrategy],
  controllers: [AuthController, GoogleController, KakaoController],
})
export class AuthModule {}
