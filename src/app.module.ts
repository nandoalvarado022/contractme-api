import { Module } from "@nestjs/common"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { TypeOrmModule } from "@nestjs/typeorm"
import { AuthModule } from "./auth/auth.module"
import { AuditLogsEntity } from "./audit_logs/audit.entity"
import { ContractModule } from "./contract/contract.module"
import { PropertyModule } from "./property/property.module"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { TypeOrmModuleOptions } from "@nestjs/typeorm"

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
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        ...getConnection(configService),
        entities: [__dirname + "/**/*.entity{.ts,.js}"], // Con esto le decimos a TypeORM donde estan las entidades (models) y creará las tablas en la BD.
        // logging: true,
        // logger: 'advanced-console',
        // synchronize: configService.get<string>("NODE_ENV") === "development",
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([AuditLogsEntity]),
    AuthModule,
    ContractModule,
    PropertyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
