import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { UserController } from './user.controller';
import { StudiesAndExperiencesEntity } from 'src/experience/experience.entity';
import { AuthService } from 'src/auth/auth.service';
import { AuditModule } from 'src/audit_logs/audit.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      StudiesAndExperiencesEntity,
    ]),
    AuditModule,
  ],
  controllers: [UserController],
  providers: [UserService, AuthService],
  exports: [UserService],
})

export class UserModule {}
