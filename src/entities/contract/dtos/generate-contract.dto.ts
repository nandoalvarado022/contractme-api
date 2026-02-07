import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsBoolean,
  IsEmail,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from "class-validator";

export class GenerateContractDto {
  @ApiProperty({
    description: "Tenant full name",
    example: "John Doe",
  })
  @IsString()
  @IsOptional()
  tennatName: string;

  @ApiProperty({
    description: "Tenant email address",
    example: "tenant@example.com",
  })
  @IsEmail()
  @IsOptional()
  tennatEmail: string;

  @ApiProperty({
    description: "Tenant phone number",
    example: "+1234567890",
  })
  @IsString()
  @IsOptional()
  tennatPhone: string;

  @ApiProperty({
    description: "Lessor (owner) full name",
    example: "Jane Smith",
  })
  @IsString()
  @IsOptional()
  lessorName: string;

  @ApiProperty({
    description: "Lessor email address",
    example: "lessor@example.com",
  })
  @IsEmail()
  @IsOptional()
  lessorEmail: string;

  @ApiProperty({
    description: "Lessor phone number",
    example: "+0987654321",
  })
  @IsString()
  @IsOptional()
  lessorPhone: string;

  @ApiProperty({
    description: "Whether the contract has been signed",
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  hasSignature: boolean;

  @ApiProperty({
    description: "Contract template ID to use",
    example: 1,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @IsInt()
  @Type(() => Number)
  templateId: number;

  @ApiProperty({
    description: "User ID generating the contract",
    example: 1,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @IsInt()
  @Type(() => Number)
  uid: number;
}
