import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    credentials: true,             // Si usas cookies o auth
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    origin: 'http://localhost',  // permite el frontend
  });
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
