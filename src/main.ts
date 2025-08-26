import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { ValidationPipe } from "@nestjs/common"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors({
    credentials: true, // Si usas cookies o auth
    methods: ["GET", "POST", "PUT", "DELETE"],
    origin: [
      "https://contractme.cloud",
      "http://localhost",
      "https://qa.contractme.cloud",
      "https://develop.contractme.cloud",
    ], // permite el frontend
  })
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }))
  await app.listen(process.env.PORT ?? 3000)
}

bootstrap()
