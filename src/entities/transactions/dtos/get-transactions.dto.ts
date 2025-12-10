import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  Min,
} from 'class-validator';

export class GetTransactionsDto {
  @ApiProperty({
    description: 'User ID to retrieve transactions for',
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
    description: 'Page number for pagination',
    example: 1,
    default: 1,
    minimum: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
    default: 10,
    minimum: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number = 10;
}
