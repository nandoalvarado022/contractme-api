import { BalanceEntity } from "src/entities/balance/entities/balance.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToOne,
  Column,
} from "typeorm";
import {
  TRANSACTION_STATUS,
  TRANSACTION_TYPE,
  TransactionType,
} from "../consts/transactions.const";
import { TransactionStatus } from "aws-sdk/clients/lakeformation";

@Entity({ name: "transactions" })
export class TransactionsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 255 })
  concept: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: "enum",
    enum: Object.values(TRANSACTION_STATUS),
    default: TRANSACTION_STATUS.COMPLETED,
  })
  status: TransactionStatus;

  @Column({
    type: "enum",
    enum: Object.values(TRANSACTION_TYPE),
    nullable: false,
  })
  type: TransactionType;

  @OneToOne(() => BalanceEntity, (balance) => balance.lastTransactionId)
  balance: BalanceEntity;

  @CreateDateColumn()
  createdAt: Date;
}
