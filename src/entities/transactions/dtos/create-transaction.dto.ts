import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  isInt,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';
import {
  TRANSACTION_TYPE,
  TransactionType,
} from '../consts/transactions.const';

export class CreateTransactionDto {
  @ApiProperty({
    description: 'User ID associated with the transaction',
    example: 1,
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @IsInt()
  @Type(() => Number)
  uid: number;

  @ApiProperty({
    description: 'Transaction description or concept',
    example: 'Payment received from client',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  concept: string;

  @ApiProperty({
    description: 'Transaction amount (must be positive)',
    example: 500.0,
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @IsInt()
  @Type(() => Number)
  amount: number;

  @ApiProperty({
    description:
      "Transaction type: 'add' to add funds, 'remove' to deduct funds",
    enum: Object.values(TRANSACTION_TYPE),
    example: 'add',
  })
  @IsEnum(TRANSACTION_TYPE)
  @IsNotEmpty()
  type: TransactionType;
}
