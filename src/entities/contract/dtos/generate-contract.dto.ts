import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { EmptyToUndefined } from "src/common/decorators";
import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from "class-validator";

export class GenerateContractDto {
  @ApiPropertyOptional({
    description:
      "Tenant user id (if the tenant is an existing registered user)",
    example: 5,
    type: Number,
  })
  @EmptyToUndefined("tenantUid")
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  tenantUid?: number;

  @ApiPropertyOptional({
    description: "Tenant full name",
    example: "John Doe",
  })
  @EmptyToUndefined()
  @IsOptional()
  @IsString()
  tenantName?: string;

  @ApiPropertyOptional({
    description: "Tenant email address",
    example: "tenant@example.com",
  })
  @EmptyToUndefined()
  @IsOptional()
  @IsEmail()
  tenantEmail?: string;

  @ApiPropertyOptional({
    description: "Tenant phone number",
    example: "+1234567890",
  })
  @EmptyToUndefined()
  @IsOptional()
  @IsString()
  tenantPhone?: string;

  @ApiPropertyOptional({
    description: "Tenant last name",
    example: "Doe",
  })
  @EmptyToUndefined()
  @IsOptional()
  @IsString()
  tenantLastname?: string;

  @ApiPropertyOptional({
    description: "Tenant document type",
    example: "CC",
  })
  @EmptyToUndefined()
  @IsOptional()
  @IsString()
  tenantDocumentType?: string;

  @ApiPropertyOptional({
    description: "Tenant document",
    example: "123456789",
  })
  @EmptyToUndefined()
  @IsOptional()
  @IsString()
  tenantDocument?: string;

  @ApiPropertyOptional({
    description: "Tenant address",
    example: "Street 123",
  })
  @EmptyToUndefined()
  @IsOptional()
  @IsString()
  tenantAddress?: string;

  @ApiPropertyOptional({
    description: "Tenant legal representative",
    example: "Representative Name",
  })
  @EmptyToUndefined()
  @IsOptional()
  @IsString()
  tenantLegalRepresentative?: string;

  @ApiPropertyOptional({
    description: "Lessor (owner) full name",
    example: "Jane Smith",
  })
  @EmptyToUndefined()
  @IsOptional()
  @IsString()
  lessorName?: string;

  @ApiPropertyOptional({
    description: "Lessor email address",
    example: "lessor@example.com",
  })
  @EmptyToUndefined()
  @IsOptional()
  @IsEmail()
  lessorEmail?: string;

  @ApiPropertyOptional({
    description: "Lessor phone number",
    example: "+0987654321",
  })
  @EmptyToUndefined()
  @IsOptional()
  @IsString()
  lessorPhone?: string;

  @ApiPropertyOptional({
    description: "Lessor last name",
    example: "Smith",
  })
  @EmptyToUndefined()
  @IsOptional()
  @IsString()
  lessorLastname?: string;

  @ApiPropertyOptional({
    description: "Lessor document",
    example: "987654321",
  })
  @EmptyToUndefined()
  @IsOptional()
  @IsString()
  lessorDocument?: string;

  @ApiPropertyOptional({
    description: "Lessor address",
    example: "Main avenue 45",
  })
  @EmptyToUndefined()
  @IsOptional()
  @IsString()
  lessorAddress?: string;

  @ApiPropertyOptional({
    description: "Lessor legal representative",
    example: "Representative Name",
  })
  @EmptyToUndefined()
  @IsOptional()
  @IsString()
  lessorLegalRepresentative?: string;

  @IsOptional()
  @EmptyToUndefined()
  @IsString()
  lessorDocumentType?: string;

  @ApiPropertyOptional({
    description: "Cosigner name",
    example: "Cosigner Name",
  })
  @EmptyToUndefined()
  @IsOptional()
  @IsString()
  cosignerName?: string;

  @ApiPropertyOptional({
    description: "Cosigner document",
    example: "1122334455",
  })
  @EmptyToUndefined()
  @IsOptional()
  @IsString()
  cosignerDocument?: string;

  @ApiPropertyOptional({
    description: "Cosigner address",
    example: "Cosigner street 10",
  })
  @EmptyToUndefined()
  @IsOptional()
  @IsString()
  cosignerAddress?: string;

  @ApiPropertyOptional({
    description: "Cosigner email",
    example: "cosigner@example.com",
  })
  @EmptyToUndefined()
  @IsOptional()
  @IsEmail()
  cosignerEmail?: string;

  @ApiPropertyOptional({
    description: "Cosigner phone",
    example: "+123498765",
  })
  @EmptyToUndefined()
  @IsOptional()
  @IsString()
  cosignerPhone?: string;

  @ApiPropertyOptional({
    description: "Contract duration",
    example: "12 months",
  })
  @EmptyToUndefined()
  @IsOptional()
  @IsString()
  duration?: string;

  @ApiPropertyOptional({
    description: "Contract canon value",
    example: "1500000",
  })
  @EmptyToUndefined()
  @IsOptional()
  @IsString()
  canon?: string;

  @ApiPropertyOptional({
    description: "Contract start date",
    example: "2026-06-01",
  })
  @EmptyToUndefined()
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    description: "Contract end date",
    example: "2027-06-01",
  })
  @EmptyToUndefined()
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({
    description: "Property address",
    example: "Property street 99",
  })
  @EmptyToUndefined()
  @IsOptional()
  @IsString()
  placeAddress?: string;

  @ApiPropertyOptional({
    description: "Property municipality",
    example: "Bogota",
  })
  @EmptyToUndefined()
  @IsOptional()
  @IsString()
  placeMunicipio?: string;

  @ApiPropertyOptional({
    description: "Property registration number",
    example: "REG-001",
  })
  @EmptyToUndefined()
  @IsOptional()
  @IsString()
  registrationNumber?: string;

  @ApiPropertyOptional({
    description: "Whether the contract has been signed",
    example: false,
  })
  @Transform(({ value }) => value === true || value === "true")
  @IsOptional()
  @IsBoolean()
  hasSignature?: boolean;

  @ApiPropertyOptional({
    description: "Contract template ID to use",
    example: 1,
    type: Number,
  })
  @EmptyToUndefined("templateId")
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @IsInt()
  @Type(() => Number)
  templateId?: number;

  @ApiPropertyOptional({
    description: "Contract PDF file (optional)",
    type: "string",
    format: "binary",
  })
  @IsOptional()
  file?: Express.Multer.File;
}
