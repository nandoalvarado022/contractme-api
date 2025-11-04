import { Module } from "@nestjs/common"
import { UserService } from "./user.service"
import { TypeOrmModule } from "@nestjs/typeorm"
import { UserEntity } from "./user.entity"
import { UserController } from "./user.controller"
import { AuthService } from "src/auth/auth.service"
import { AuditModule } from "src/entities/audit_logs/audit.module"
import { EducationModule } from "src/entities/education/education.module"
import { ExperienceModule } from "src/entities/experience/experience.module"
import { ReferenceModule } from "src/entities/reference/reference.module"
import { MailModule } from "src/common/emails/mail.module"

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    AuditModule,
    EducationModule,
    ExperienceModule,
    ReferenceModule,
    MailModule
  ],
  controllers: [UserController],
  providers: [UserService, AuthService],
  exports: [UserService],
})
export class UserModule {}
