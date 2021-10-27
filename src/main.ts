import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';

import { AppModule } from '@/app.module';

const ORIGIN = process.env.NODE_ENV === 'production' ? 'https://tsufia.netlify.app' : 'http://localhost:3000';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  app.enableCors({ credentials: true, origin: ORIGIN });
  await app.listen(process.env.PORT || 4000);
}
bootstrap();
