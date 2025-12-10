import { ApiProperty } from '@nestjs/swagger';
import { BalanceEntity } from 'src/entities/balance/entities/balance.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToOne,
  Column,
} from 'typeorm';
import {
  TRANSACTION_STATUS,
  TRANSACTION_TYPE,
  TransactionType,
} from '../consts/transactions.const';
import { TransactionStatus } from 'aws-sdk/clients/lakeformation';

@Entity({ name: 'transactions' })
export class TransactionsEntity {
  @ApiProperty({
    description: 'Unique identifier for the transaction',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Transaction description or concept',
    example: 'Payment received from client',
    maxLength: 255,
  })
  @Column({ type: 'varchar', length: 255 })
  concept: string;

  @ApiProperty({
    description: 'Transaction amount',
    example: 500.0,
    type: Number,
  })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @ApiProperty({
    description: 'Transaction status',
    enum: Object.values(TRANSACTION_STATUS),
    example: 'completed',
    default: 'completed',
  })
  @Column({
    type: 'enum',
    enum: Object.values(TRANSACTION_STATUS),
    default: TRANSACTION_STATUS.COMPLETED,
  })
  status: TransactionStatus;

  @ApiProperty({
    description: 'Transaction type - add funds or remove funds',
    enum: Object.values(TRANSACTION_TYPE),
    example: 'add',
  })
  @Column({
    type: 'enum',
    enum: Object.values(TRANSACTION_TYPE),
    nullable: false,
  })
  type: TransactionType;

  @ApiProperty({
    description: 'Associated balance record',
    type: () => BalanceEntity,
  })
  @OneToOne(() => BalanceEntity, (balance) => balance.lastTransactionId)
  balance: BalanceEntity;

  @ApiProperty({
    description: 'Transaction creation timestamp',
    example: '2025-12-09T10:00:00.000Z',
  })
  @CreateDateColumn()
  createdAt: Date;
}
