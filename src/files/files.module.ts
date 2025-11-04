import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "src/entities/user/user.entity";
import { FilesController } from "./files.controller";
import { FilesService } from "./files.service";

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([UserEntity])],
  exports: [FilesService],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
