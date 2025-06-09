import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { StudiesAndExperiencesEntity } from './experience/experience.entity';
import { AuditLogsEntity } from './audit_logs/audit_logs.entity';
import { ContractModule } from './contracts/contract.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '3.209.97.88',
      username: 'remote_user',
      password: 'Gabs1515++',
      port: 3306,
      database: 'contract_me',
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // Con esto le decimos a TypeORM donde estan las entidades (models) y creará las tablas en la BD.
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
