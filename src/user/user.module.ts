import { Module } from "@nestjs/common"
import { UserService } from "./user.service"
import { TypeOrmModule } from "@nestjs/typeorm"
import { UserEntity } from "./user.entity"
import { UserController } from "./user.controller"
import { AuthService } from "src/auth/auth.service"
import { AuditModule } from "src/audit_logs/audit.module"
import { EducationModule } from "src/education/education.module"
import { ExperienceModule } from "src/experience/experience.module"
import { ReferenceModule } from "src/reference/reference.module"

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    AuditModule,
    EducationModule,
    ExperienceModule,
    ReferenceModule,
  ],
  controllers: [UserController],
  providers: [UserService, AuthService],
  exports: [UserService],
})
export class UserModule {}
