import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsEmail,
  IsEnum,
  isInt,
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
  @ApiProperty({
    description:
      "User ID associated with the transaction (required if email is not provided)",
    example: 1,
    type: Number,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @IsPositive()
  @IsInt()
  @Type(() => Number)
  uid?: number;

  @ApiProperty({
    description:
      "User email associated with the transaction (required if uid is not provided)",
    example: "alvaropedrozo07@gmail.com",
    required: false,
    type: String,
  })
  @IsString()
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: "Transaction description or concept",
    example: "Payment received from client",
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  concept: string;

  @ApiProperty({
    description:
      "Transaction amount (must be positive, in cents or smallest currency unit)",
    example: 50000,
    type: Number,
    minimum: 1,
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
    example: "add",
  })
  @IsEnum(TRANSACTION_TYPE)
  @IsNotEmpty()
  type: TransactionType;
}
