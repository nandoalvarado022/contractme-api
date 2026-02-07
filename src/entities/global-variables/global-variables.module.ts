import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GlobalVariablesEntity } from "./global-variables.entity";
import { GlobalVariablesService } from "./global-variables.service";

@Module({
  imports: [TypeOrmModule.forFeature([GlobalVariablesEntity])],
  providers: [GlobalVariablesService],
  exports: [GlobalVariablesService],
})
export class GlobalVariablesModule {}
