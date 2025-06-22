import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { StudiesAndExperiencesEntity } from './experience/experience.entity';
import { AuditLogsEntity } from './audit_logs/audit_logs.entity';
import { ContractModule } from './contract/contract.module';

import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const localConection: TypeOrmModuleOptions = {
  type: 'mysql' as const,
  host: 'localhost',
  username: 'root',
  password: '12345678',
  database: 'contract-me',
  port: 3306,
};

const remoteConection: TypeOrmModuleOptions = {
  type: 'mysql' as const,
  host: '3.209.97.88',
  username: 'remote_user',
  password: 'Gabs1515++',
  port: 3306,
  database: 'contract_me',
};

const connection = process.env.NODE_ENV === 'production' ? remoteConection : remoteConection;

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...connection,
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // Con esto le decimos a TypeORM donde estan las entidades (models) y creará las tablas en la BD.
      logging: true,
      logger: 'advanced-console',
      // synchronize: true, // Con esto le decimos a TypeORM que cada vez que arranque la aplicacion, sincronice las entidades con la base de datos. Es decir que cree las tablas si no existen, y las modifique si es necesario segun las entidades en los archivos .ts y .js
    }),
    TypeOrmModule.forFeature([
      AuditLogsEntity,
    ]),
    AuthModule,
    ContractModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
