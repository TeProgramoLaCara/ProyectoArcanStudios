import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,            // elimina campos que no estén en el DTO
      forbidNonWhitelisted: true, // lanza error si envían campos extra
      transform: true,            // convierte tipos automáticamente
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
