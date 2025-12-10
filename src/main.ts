import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    credentials: true, // Si usas cookies o auth
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    origin: true,
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'Cookie',
      'Auth',
      'Uid',
      'X-Auth-Token',
    ],
    exposedHeaders: ['Set-Cookie'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
