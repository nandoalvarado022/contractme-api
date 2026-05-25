import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { DatabaseBackupService } from './database-backup.service';
import { BackupController } from './backup.controller';
import { BalanceEntity } from '../entities/balance/entities/balance.entity';
import { TransactionsEntity } from '../entities/transactions/entities/transactions.entity';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule,
    TypeOrmModule.forFeature([BalanceEntity, TransactionsEntity]),
  ],
  controllers: [BackupController],
  providers: [DatabaseBackupService],
  exports: [DatabaseBackupService],
})
export class CronModule {}
