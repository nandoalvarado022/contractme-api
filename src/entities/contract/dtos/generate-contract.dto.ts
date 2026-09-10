import { ApiPropertyOptional } from "@nestjs/swagger";
import { Expose, Transform, Type } from "class-transformer";
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
  @Expose({ name: "tenant_uid" })
  @EmptyToUndefined("tenant_uid")
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  tenantUid?: number;

  @ApiPropertyOptional({
    description: "Tenant full name",
    example: "John Doe",
  })
  @Expose({ name: "tenant_name" })
  @EmptyToUndefined()
  @IsOptional()
  @IsString()
  tenantName?: string;

  @ApiPropertyOptional({
    description: "Tenant email address",
    example: "tenant@example.com",
  })
  @Expose({ name: "tenant_email" })
  @EmptyToUndefined()
  @IsOptional()
  @IsEmail()
  tenantEmail?: string;

  @ApiPropertyOptional({
    description: "Tenant phone number",
    example: "+1234567890",
  })
  @Expose({ name: "tenant_phone" })
  @EmptyToUndefined()
  @IsOptional()
  @IsString()
  tenantPhone?: string;

  @ApiPropertyOptional({
    description: "Tenant last name",
    example: "Doe",
  })
  @Expose({ name: "tenant_lastname" })
  @EmptyToUndefined()
  @IsOptional()
  @IsString()
  tenantLastname?: string;

  @ApiPropertyOptional({
    description: "Tenant document type",
    example: "CC",
  })
  @Expose({ name: "tenant_document_type" })
  @EmptyToUndefined()
  @IsOptional()
  @IsString()
  tenantDocumentType?: string;

  @ApiPropertyOptional({
    description: "Tenant document",
    example: "123456789",
  })
  @Expose({ name: "tenant_document" })
  @EmptyToUndefined()
  @IsOptional()
  @IsString()
  tenantDocument?: string;

  @ApiPropertyOptional({
    description: "Tenant address",
    example: "Street 123",
  })
  @Expose({ name: "tenant_address" })
  @EmptyToUndefined()
  @IsOptional()
  @IsString()
  tenantAddress?: string;

  @ApiPropertyOptional({
    description: "Tenant legal representative",
    example: "Representative Name",
  })
  @Expose({ name: "tenant_legal_representative" })
  @EmptyToUndefined()
  @IsOptional()
  @IsString()
  tenantLegalRepresentative?: string;

  @ApiPropertyOptional({
    description: "Lessor (owner) full name",
    example: "Jane Smith",
  })
  @Expose({ name: "lessor_name" })
  @EmptyToUndefined()
  @IsOptional()
  @IsString()
  lessorName?: string;

  @ApiPropertyOptional({
    description: "Lessor email address",
    example: "lessor@example.com",
  })
  @Expose({ name: "lessor_email" })
  @EmptyToUndefined()
  @IsOptional()
  @IsEmail()
  lessorEmail?: string;

  @ApiPropertyOptional({
    description: "Lessor phone number",
    example: "+0987654321",
  })
  @Expose({ name: "lessor_phone" })
  @EmptyToUndefined()
  @IsOptional()
  @IsString()
  lessorPhone?: string;

  @ApiPropertyOptional({
    description: "Lessor last name",
    example: "Smith",
  })
  @Expose({ name: "lessor_lastname" })
  @EmptyToUndefined()
  @IsOptional()
  @IsString()
  lessorLastname?: string;

  @ApiPropertyOptional({
    description: "Lessor document",
    example: "987654321",
  })
  @Expose({ name: "lessor_document" })
  @EmptyToUndefined()
  @IsOptional()
  @IsString()
  lessorDocument?: string;

  @ApiPropertyOptional({
    description: "Lessor address",
    example: "Main avenue 45",
  })
  @Expose({ name: "lessor_address" })
  @EmptyToUndefined()
  @IsOptional()
  @IsString()
  lessorAddress?: string;

  @ApiPropertyOptional({
    description: "Lessor legal representative",
    example: "Representative Name",
  })
  @Expose({ name: "lessor_legal_representative" })
  @EmptyToUndefined()
  @IsOptional()
  @IsString()
  lessorLegalRepresentative?: string;

  @IsOptional()
  @Expose({ name: "lessor_document_type" })
  @EmptyToUndefined()
  @IsString()
  lessorDocumentType?: string;

  @ApiPropertyOptional({
    description: "Cosigner name",
    example: "Cosigner Name",
  })
  @Expose({ name: "cosigner_name" })
  @EmptyToUndefined()
  @IsOptional()
  @IsString()
  cosignerName?: string;

  @ApiPropertyOptional({
    description: "Cosigner document",
    example: "1122334455",
  })
  @Expose({ name: "cosigner_document" })
  @EmptyToUndefined()
  @IsOptional()
  @IsString()
  cosignerDocument?: string;

  @ApiPropertyOptional({
    description: "Cosigner address",
    example: "Cosigner street 10",
  })
  @Expose({ name: "cosigner_address" })
  @EmptyToUndefined()
  @IsOptional()
  @IsString()
  cosignerAddress?: string;

  @ApiPropertyOptional({
    description: "Cosigner email",
    example: "cosigner@example.com",
  })
  @Expose({ name: "cosigner_email" })
  @EmptyToUndefined()
  @IsOptional()
  @IsEmail()
  cosignerEmail?: string;

  @ApiPropertyOptional({
    description: "Cosigner phone",
    example: "+123498765",
  })
  @Expose({ name: "cosigner_phone" })
  @EmptyToUndefined()
  @IsOptional()
  @IsString()
  cosignerPhone?: string;

  @ApiPropertyOptional({
    description: "Contract duration",
    example: "12 months",
  })
  @Expose({ name: "duration" })
  @EmptyToUndefined()
  @IsOptional()
  @IsString()
  duration?: string;

  @ApiPropertyOptional({
    description: "Contract canon value",
    example: "1500000",
  })
  @Expose({ name: "canon" })
  @EmptyToUndefined()
  @IsOptional()
  @IsString()
  canon?: string;

  @ApiPropertyOptional({
    description: "Contract start date",
    example: "2026-06-01",
  })
  @Expose({ name: "start_date" })
  @EmptyToUndefined()
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    description: "Contract end date",
    example: "2027-06-01",
  })
  @Expose({ name: "end_date" })
  @EmptyToUndefined()
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({
    description: "Property address",
    example: "Property street 99",
  })
  @Expose({ name: "place_address" })
  @EmptyToUndefined()
  @IsOptional()
  @IsString()
  placeAddress?: string;

  @ApiPropertyOptional({
    description: "Property municipality",
    example: "Bogota",
  })
  @Expose({ name: "place_municipio" })
  @EmptyToUndefined()
  @IsOptional()
  @IsString()
  placeMunicipio?: string;

  @ApiPropertyOptional({
    description: "Property registration number",
    example: "REG-001",
  })
  @Expose({ name: "registration_number" })
  @EmptyToUndefined()
  @IsOptional()
  @IsString()
  registrationNumber?: string;

  @ApiPropertyOptional({
    description: "Whether the contract has been signed",
    example: false,
  })
  @Expose({ name: "has_signature" })
  @Transform(({ value }) => value === true || value === "true")
  @IsOptional()
  @IsBoolean()
  hasSignature?: boolean;

  @ApiPropertyOptional({
    description: "Contract template ID to use",
    example: 1,
    type: Number,
  })
  @Expose({ name: "template_id" })
  @EmptyToUndefined("template_id")
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
