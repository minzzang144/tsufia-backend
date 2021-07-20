import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'dummy-password',
      database: 'tsufia-database',
      entities: [],
      synchronize: true,
    }),
  ],
})
export class AppModule {}
