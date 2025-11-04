import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/entities/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants/jwt.constant';
import { AuditLogService } from 'src/entities/audit_logs/audit.service';
import { AuditModule } from 'src/entities/audit_logs/audit.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailModule } from 'src/common/emails/mail.module';
import { MailService } from 'src/common/emails/mail.service';

@Module({
  imports: [
    AuditModule,
    UserModule,
    MailerModule,
    MailModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, MailService],
})

export class AuthModule {}
