import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConsoleLogger, ValidationPipe, Logger } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ["log", "error", "warn", "debug", "verbose"],
  });

  app.enableCors({
    credentials: true, // Si usas cookies o auth
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"],
    origin: "*",
    exposedHeaders: ["Set-Cookie"],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle("ContractMe API")
    .setDescription("API documentation for ContractMe platform")
    .setVersion("1.0")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        name: "JWT",
        description: "Enter JWT token",
        in: "header",
      },
      "JWT-auth",
    )
    .addTag("Balance", "Balance management endpoints")
    .addTag("Transactions", "Transaction management endpoints")
    .addTag("Auth", "Authentication endpoints")
    .addTag("Users", "User management endpoints")
    .addTag("Files", "File management endpoints")
    .addTag("Properties", "Property management endpoints")
    .addTag("Education", "Education management endpoints")
    .addTag("Experience", "Experience management endpoints")
    .addTag("References", "Reference management endpoints")
    .addTag("Contracts", "Contract management endpoints")
    .addTag("Reconciliation", "Reconciliation management endpoints")
    .addTag("Landing Page", "Landing page managment endpoints")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("/docs", app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
