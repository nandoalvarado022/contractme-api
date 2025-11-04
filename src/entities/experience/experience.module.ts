import { Module } from "@nestjs/common"
import { ExperienceService } from "./experience.service"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ExperienceEntity } from "./experience.entity"
import { UserEntity } from "src/entities/user/user.entity"
import { ExperienceController } from "./experience.controller"

@Module({
  imports: [TypeOrmModule.forFeature([ExperienceEntity, UserEntity])],
  controllers: [ExperienceController],
  providers: [ExperienceService],
  exports: [ExperienceService],
})
export class ExperienceModule {}
