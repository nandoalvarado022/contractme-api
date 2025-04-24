import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { UserController } from './user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])], // Se debe añadir las entidades que se van a usar en el módulo.
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
