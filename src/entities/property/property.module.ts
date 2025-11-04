import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { PropertyController } from "./property.controller"
import { PropertyService } from "./property.service"
import { PropertyEntity } from "./property.entity"
import { PropertyNote } from "./property-note.entity"
import { PropertyInterested } from "./property-interested.entity"
import { UserEntity } from "src/entities/user/user.entity"

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PropertyEntity,
      PropertyNote,
      PropertyInterested,
      UserEntity,
    ]),
  ],
  controllers: [PropertyController],
  providers: [PropertyService],
  exports: [PropertyService],
})
export class PropertyModule {}
