import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      username: 'root',
      password: '12345678',
      port: 3306,
      database: 'contract-me',
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // Con esto le decimos a TypeORM donde estan las entidades (models) y creará las tablas en la BD.
      // synchronize: true, // Con esto le decimos a TypeORM que cada vez que arranque la aplicacion, sincronice las entidades con la base de datos. Es decir que cree las tablas si no existen, y las modifique si es necesario segun las entidades en los archivos .ts y .js
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
