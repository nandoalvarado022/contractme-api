import { TransactionsEntity } from "src/entities/transactions/entities/transactions.entity";
import { UserEntity } from "src/entities/user/user.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  DeleteDateColumn,
  JoinColumn,
} from "typeorm";

@Entity({ name: "balance" })
export class BalanceEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => TransactionsEntity, (transaction) => transaction.balance)
  @JoinColumn({ name: "last_transaction_id" })
  lastTransactionId: TransactionsEntity;

  @Column()
  last_transaction_id: number;

  @Column()
  uid: number;

  @OneToOne(() => UserEntity, (user) => user.balance)
  @JoinColumn({ name: "uid" })
  user: UserEntity;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  amount: number;

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
