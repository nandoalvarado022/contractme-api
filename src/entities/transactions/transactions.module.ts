import { Module } from "@nestjs/common";
import { TransactionsService } from "./transaction.service";
import { TransactionsController } from "./transactions.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TransactionsEntity } from "./entities/transactions.entity";
import { BalanceEntity } from "../balance/entities/balance.entity";
import { UserEntity } from "../user/user.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionsEntity, BalanceEntity, UserEntity]),
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService],
})
export class TransactionModule {}
