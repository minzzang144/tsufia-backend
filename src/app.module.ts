import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from './common/common.module';
import * as Joi from 'joi';

import { AppGateway } from '@/app.gateway';
import { AuthModule } from '@auth/auth.module';
import { UsersModule } from '@users/users.module';
import { User } from '@users/entities/user.entity';
import { RoomsModule } from '@rooms/rooms.module';
import { Room } from '@rooms/entities/room.entity';
import { ChatsModule } from '@chats/chats.module';
import { Chat } from '@chats/entities/chat.entity';
import { GamesModule } from '@games/games.module';
import { Game } from '@games/entities/game.entity';
import { RoomsService } from '@rooms/rooms.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'development' ? '.env.development' : '.env.test',
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production', 'test').required(),
        DB_HOST: Joi.string(),
        DB_PORT: Joi.string(),
        DB_USERNAME: Joi.string(),
        DB_PASSWORD: Joi.string(),
        DB_NAME: Joi.string(),
        JWT_ACCESS_TOKEN_SECRET_KEY: Joi.string().required(),
        JWT_REFRESH_TOKEN_SECRET_KEY: Joi.string().required(),
        JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, Room, Chat, Game],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, Room, Game]),
    AuthModule,
    CommonModule,
    UsersModule,
    RoomsModule,
    ChatsModule,
    GamesModule,
  ],
  providers: [AppGateway, RoomsService],
})
export class AppModule {}
