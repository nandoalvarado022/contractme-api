import { Type } from "class-transformer";
import {
  IsDecimal,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from "class-validator";
import {
  TRANSACTION_TYPE,
  TransactionType,
} from "../consts/transactions.const";

export class CreateTransactionDto {
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @IsInt()
  @Type(() => Number)
  uid: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  concept: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @IsDecimal()
  @Type(() => Number)
  amount: number;

  @IsEnum(TRANSACTION_TYPE)
  @IsNotEmpty()
  type: TransactionType;
}
