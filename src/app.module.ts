import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./auth/auth.module";
import { AuditLogsEntity } from "./entities/audit_logs/audit.entity";
import { ContractModule } from "./entities/contract/contract.module";
import { PropertyModule } from "./entities/property/property.module";
import { EducationModule } from "./entities/education/education.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { ExperienceModule } from "./entities/experience/experience.module";
import { UserModule } from "./entities/user/user.module";
import { ReferenceModule } from "./entities/reference/reference.module";
import { MailerModule } from "@nestjs-modules/mailer";
import { FilesModule } from "./files/files.module";
import { MailModule } from "./common/emails/mail.module";
import { ContactModule } from "./entities/contact/contact.module";
import { BalanceModule } from "./entities/balance/balance.module";
import { TransactionModule } from "./entities/transactions/transactions.module";
import { CronModule } from "./cron/cron.module";
import { UserMiddleware } from "./common/middlewares/user.middleware";
import { GlobalVariablesModule } from "./entities/global-variables/global-variables.module";
import { CamelToSnakeCaseInterceptor } from "./common/interceptors/camel-to-snake-case.interceptor";
import { buildDataSourceOptions } from "./database/data-source";

const getConnection = (configService: ConfigService): TypeOrmModuleOptions =>
  buildDataSourceOptions((key) => configService.get<string>(key));

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: "email-smtp.us-east-1.amazonaws.com",
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
      useFactory: (configService: ConfigService) =>
        getConnection(configService),
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
    BalanceModule,
    TransactionModule,
    CronModule,
    GlobalVariablesModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CamelToSnakeCaseInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserMiddleware).forRoutes("*");
  }
}
