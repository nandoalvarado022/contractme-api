import { Module } from "@nestjs/common"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { TypeOrmModule } from "@nestjs/typeorm"
import { AuthModule } from "./auth/auth.module"
import { AuditLogsEntity } from "./entities/audit_logs/audit.entity"
import { ContractModule } from "./entities/contract/contract.module"
import { PropertyModule } from "./entities/property/property.module"
import { EducationModule } from "./entities/education/education.module"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { TypeOrmModuleOptions } from "@nestjs/typeorm"
import { ExperienceModule } from "./entities/experience/experience.module"
import { UserModule } from "./entities/user/user.module"
import { ReferenceModule } from "./entities/reference/reference.module"
import { MailService } from "./common/emails/mail.service"
import { MailerModule, MailerService } from '@nestjs-modules/mailer'
import { FilesModule } from "./files/files.module"
import { MailModule } from "./common/emails/mail.module"
import { ContactModule } from "./entities/contact/contact.module"

const getDBConfig = (
  configService: ConfigService,
  env: string
): TypeOrmModuleOptions => {
  const prefix = `DB_${env}`
  return {
    type: configService.get("DB_TYPE") as "mysql",
    host: configService.get<string>(`${prefix}_HOST`),
    username: configService.get<string>(`${prefix}_USERNAME`),
    password: configService.get<string>(`${prefix}_PASSWORD`),
    database: configService.get<string>(`${prefix}_DATABASE`),
    port: configService.get<number>(`${prefix}_PORT`),
  }
}

const getConnection = (configService: ConfigService): TypeOrmModuleOptions => {
  const nodeEnv = configService.get<string>("NODE_ENV")
  const env = nodeEnv === "production" ? "REMOTE" : "LOCAL"
  return getDBConfig(configService, env)
}

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async () => ({
        transport: {
          host: 'email-smtp.us-east-1.amazonaws.com',
          port: 587,
          secure: false,
          auth: {
            user: process.env.BREVO_KEY,
            pass: process.env.BREVO_SECRET_KEY,
          },
        },
        defaults: {
          from: '"Mi App" <no-reply@contractme.cloud>',
        },
      }),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        ...getConnection(configService),
        entities: [__dirname + "/**/*.entity{.ts,.js}"],
        synchronize: false,
        logging: true,
        // logger: 'advanced-console',
        // synchronize: configService.get<string>("NODE_ENV") === "development",
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([AuditLogsEntity]),
    AuthModule,
    ContractModule,
    PropertyModule,
    EducationModule,
    UserModule,
    ExperienceModule,
    ReferenceModule,
    FilesModule,
    MailModule,
    ContactModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule { }
