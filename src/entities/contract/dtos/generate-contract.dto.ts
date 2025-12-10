import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsBoolean,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from "class-validator";

export class GenerateContractDto {
  @ApiProperty({
    description: "Tenant full name",
    example: "John Doe",
  })
  @IsString()
  @IsNotEmpty()
  tennatName: string;

  @ApiProperty({
    description: "Tenant email address",
    example: "tenant@example.com",
  })
  @IsEmail()
  @IsNotEmpty()
  tennatEmail: string;

  @ApiProperty({
    description: "Tenant phone number",
    example: "+1234567890",
  })
  @IsString()
  @IsNotEmpty()
  tennatPhone: string;

  @ApiProperty({
    description: "Lessor (owner) full name",
    example: "Jane Smith",
  })
  @IsString()
  @IsNotEmpty()
  lessorName: string;

  @ApiProperty({
    description: "Lessor email address",
    example: "lessor@example.com",
  })
  @IsEmail()
  @IsNotEmpty()
  lessorEmail: string;

  @ApiProperty({
    description: "Lessor phone number",
    example: "+0987654321",
  })
  @IsString()
  @IsNotEmpty()
  lessorPhone: string;

  @ApiProperty({
    description: "Whether the contract has been signed",
    example: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  hasSignature: boolean;

  @ApiProperty({
    description: "Contract template ID to use",
    example: 1,
    type: Number,
  })
  @IsNotEmpty()
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
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @IsInt()
  @Type(() => Number)
  uid: number;
}
