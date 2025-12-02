import { Module } from "@nestjs/common";
import { BalanceController } from "./balance.controller";
import { BalanceService } from "./balance.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BalanceEntity } from "./entities/balance.entity";

@Module({
  imports: [TypeOrmModule.forFeature([BalanceEntity])],
  controllers: [BalanceController],
  providers: [BalanceService],
  exports: [BalanceService],
})
export class BalanceModule {}
