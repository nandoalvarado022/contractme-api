import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { ValidationPipe } from "@nestjs/common"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors({
    credentials: true, // Si usas cookies o auth
    methods: ["GET", "POST", "PUT", "DELETE"],
    origin: [
      "https://app.contractme.cloud",
      "http://localhost",
      "http://localhost:4321", // landing page
      "https://qa.app.contractme.cloud",
      "https://develop.app.contractme.cloud",
    ],
  })

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }))

  await app.listen(process.env.PORT ?? 3000)
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap()
