import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Prefijo global para todas las rutas
  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,            // elimina campos que no estén en el DTO
      forbidNonWhitelisted: true, // lanza error si envían campos extra
      transform: true,            // convierte tipos automáticamente
    }),
  );

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Arcan Studios API')
    .setDescription('Documentación de la API para la gestión de reservas de Arcan Studios')
    .setVersion('1.0')
    .addTag('Reservas')
    .addTag('Usuarios')
    .addTag('Profesores')
    .addTag('Cursos')
    .addTag('Empresas')
    .addTag('Aulas')
    .addTag('Sesiones')
    .addTag('Capacitaciones')
    .addTag('Perfiles')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on: http://localhost:${process.env.PORT ?? 3000}/api`);
  console.log(`Swagger documentation: http://localhost:${process.env.PORT ?? 3000}/api/docs`);
}
bootstrap();
