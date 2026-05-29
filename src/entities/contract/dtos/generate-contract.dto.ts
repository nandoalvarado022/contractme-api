import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Expose, Transform, Type } from "class-transformer";
import {
  IsBoolean,
  IsEmail,
  IsInt,
  IsNotEmpty,
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
  @Expose({ name: "tennat_name" })
  @IsOptional()
  @IsString()
  tennatName: string;

  @ApiProperty({
    description: "Tenant email address",
    example: "tenant@example.com",
  })
  @Expose({ name: "tennat_email" })
  @IsEmail()
  @IsOptional()
  tennatEmail: string;

  @ApiProperty({
    description: "Tenant phone number",
    example: "+1234567890",
  })
  @Expose({ name: "tennat_phone" })
  @IsOptional()
  @IsString()
  tennatPhone: string;

  @ApiProperty({
    description: "Lessor (owner) full name",
    example: "Jane Smith",
  })
  @Expose({ name: "lessor_name" })
  @IsOptional()
  @IsString()
  lessorName: string;

  @ApiProperty({
    description: "Lessor email address",
    example: "lessor@example.com",
  })
  @Expose({ name: "lessor_email" })
  @IsOptional()
  @IsEmail()
  lessorEmail: string;

  @ApiProperty({
    description: "Lessor phone number",
    example: "+0987654321",
  })
  @Expose({ name: "lessor_phone" })
  @IsOptional()
  @IsString()
  lessorPhone: string;

  @ApiProperty({
    description: "Whether the contract has been signed",
    example: false,
  })
  @Expose({ name: "has_signature" })
  @Transform(({ value }) => value === true || value === "true")
  @IsOptional()
  @IsBoolean()
  hasSignature: boolean;

  @ApiProperty({
    description: "Contract template ID to use",
    example: 1,
    type: Number,
  })
  @Expose({ name: "template_id" })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @IsInt()
  @Type(() => Number)
  templateId: number;

  @ApiPropertyOptional({
    description: "Contract PDF file (optional)",
    type: "string",
    format: "binary",
  })
  @IsOptional()
  file?: Express.Multer.File;
}
