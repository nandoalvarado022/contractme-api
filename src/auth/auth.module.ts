import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { MailerModule } from "@nestjs-modules/mailer";
import { MailModule } from "src/common/emails/mail.module";
import { MailService } from "src/common/emails/mail.service";
import { AuditModule } from "src/entities/audit_logs/audit.module";
import { UserModule } from "src/entities/user/user.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { getJwtSecret } from "./constants/jwt.constant";

@Module({
  imports: [
    AuditModule,
    UserModule,
    MailerModule,
    MailModule,
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: getJwtSecret(configService),
        signOptions: { expiresIn: "1d" },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, MailService],
})
export class AuthModule {}
