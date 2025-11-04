import { Module } from "@nestjs/common";
import { ReferenceService } from "./reference.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ReferenceEntity } from "./reference.entity";
import { ReferenceController } from "./reference.controller";

@Module({
  imports: [TypeOrmModule.forFeature([ReferenceEntity])],
  controllers: [ReferenceController],
  providers: [ReferenceService],
  exports: [ReferenceService],
})
export class ReferenceModule {}
