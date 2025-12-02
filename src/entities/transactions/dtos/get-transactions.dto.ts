import { Type } from "class-transformer";
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  Min,
} from "class-validator";

export class GetTransactionsDto {
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @IsInt()
  @Type(() => Number)
  uid: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number = 10;
}
