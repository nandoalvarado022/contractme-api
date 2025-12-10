import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BalanceReconciliationService } from "./balance-reconciliation.service";
import { ReconciliationController } from "./reconciliation.controller";
import { BalanceEntity } from "../entities/balance/entities/balance.entity";
import { TransactionsEntity } from "../entities/transactions/entities/transactions.entity";

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([BalanceEntity, TransactionsEntity]),
  ],
  controllers: [ReconciliationController],
  providers: [BalanceReconciliationService],
  exports: [BalanceReconciliationService],
})
export class CronModule {}
