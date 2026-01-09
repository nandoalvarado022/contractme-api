import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { BalanceReconciliationService } from "./balance-reconciliation.service";
import { DatabaseBackupService } from "./database-backup.service";
import { ReconciliationController } from "./reconciliation.controller";
import { BackupController } from "./backup.controller";
import { BalanceEntity } from "../entities/balance/entities/balance.entity";
import { TransactionsEntity } from "../entities/transactions/entities/transactions.entity";

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule,
    TypeOrmModule.forFeature([BalanceEntity, TransactionsEntity]),
  ],
  controllers: [ReconciliationController, BackupController],
  providers: [BalanceReconciliationService, DatabaseBackupService],
  exports: [BalanceReconciliationService, DatabaseBackupService],
})
export class CronModule {}
