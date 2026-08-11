import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { MailerModule } from "@nestjs-modules/mailer";
import { MailModule } from "src/common/emails/mail.module";
import { MailService } from "src/common/emails/mail.service";
import { AuditModule } from "src/entities/audit_logs/audit.module";
import { UserModule } from "src/entities/user/user.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { jwtConstants } from "./constants/jwt.constant";

@Module({
  imports: [
    AuditModule,
    UserModule,
    MailerModule,
    MailModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: "1d" },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, MailService],
})
export class AuthModule {}
