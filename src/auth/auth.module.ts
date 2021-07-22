import { Module } from '@nestjs/common';

import { AuthService } from '@auth/auth.service';
import { UsersModule } from '@users/users.module';

@Module({
  imports: [UsersModule],
  providers: [AuthService],
})
export class AuthModule {}
