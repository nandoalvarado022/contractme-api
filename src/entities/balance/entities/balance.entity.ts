import { ApiProperty } from '@nestjs/swagger';
import { TransactionsEntity } from 'src/entities/transactions/entities/transactions.entity';
import { UserEntity } from 'src/entities/user/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  DeleteDateColumn,
  JoinColumn,
} from 'typeorm';

@Entity({ name: 'balance' })
export class BalanceEntity {
  @ApiProperty({
    description: 'Unique identifier for the balance',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Last transaction associated with this balance',
    type: () => TransactionsEntity,
  })
  @OneToOne(() => TransactionsEntity, (transaction) => transaction.balance, {
    nullable: true,
  })
  @JoinColumn({ name: 'last_transaction_id' })
  lastTransactionId: TransactionsEntity;

  @ApiProperty({
    description: 'ID of the last transaction',
    example: 5,
  })
  @Column({ nullable: true })
  last_transaction_id: number;

  @ApiProperty({
    description: 'User ID associated with this balance',
    example: 1,
  })
  @Column()
  uid: number;

  @ApiProperty({
    description: 'User associated with this balance',
    type: () => UserEntity,
  })
  @OneToOne(() => UserEntity, (user) => user.balance)
  @JoinColumn({ name: 'uid' })
  user: UserEntity;

  @ApiProperty({
    description: 'Current balance amount',
    example: 1000.5,
    type: Number,
  })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  amount: number;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2025-12-09T10:00:00.000Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2025-12-09T10:00:00.000Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Soft deletion timestamp',
    example: null,
    required: false,
  })
  @DeleteDateColumn()
  deletedAt: Date;
}
