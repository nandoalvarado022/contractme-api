import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
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
    description: "Lessor (owner) full name",
    example: "Jane Smith",
  })
  @IsOptional()
  @IsString()
  lessorName?: string;

  @ApiPropertyOptional({
    description: "Lessor last name",
    example: "Smith",
  })
  @IsOptional()
  @IsString()
  lessorLastname?: string;

  @ApiProperty({
    description: "Lessor email address",
    example: "lessor@example.com",
  })
  @Transform(({ value }) => (value === "" ? undefined : value))
  @IsOptional()
  @IsEmail()
  lessorEmail?: string;

  @ApiProperty({
    description: "Lessor phone number",
    example: "+0987654321",
  })
  @IsOptional()
  @IsString()
  lessorPhone?: string;

  @ApiPropertyOptional({
    description: "Lessor document type",
    example: "CC",
  })
  @IsOptional()
  @IsString()
  lessorDocumentType?: string;

  @ApiPropertyOptional({
    description: "Lessor document number",
    example: "1234567890",
  })
  @IsOptional()
  @IsString()
  lessorDocument?: string;

  @ApiPropertyOptional({
    description: "Lessor address",
    example: "Calle 10 #20-30",
  })
  @IsOptional()
  @IsString()
  lessorAddress?: string;

  @ApiPropertyOptional({
    description: "Lessor legal representative",
    example: "Carlos Perez",
  })
  @IsOptional()
  @IsString()
  lessorLegalRepresentative?: string;

  @ApiProperty({
    description: "Tenant full name",
    example: "John Doe",
  })
  @IsOptional()
  @IsString()
  tenantName?: string;

  @ApiPropertyOptional({
    description: "Tenant last name",
    example: "Doe",
  })
  @IsOptional()
  @IsString()
  tenantLastname?: string;

  @ApiProperty({
    description: "Tenant email address",
    example: "tenant@example.com",
  })
  @Transform(({ value }) => (value === "" ? undefined : value))
  @IsOptional()
  @IsEmail()
  tenantEmail?: string;

  @ApiProperty({
    description: "Tenant phone number",
    example: "+1234567890",
  })
  @IsOptional()
  @IsString()
  tenantPhone?: string;

  @ApiPropertyOptional({
    description: "Tenant document type",
    example: "CC",
  })
  @IsOptional()
  @IsString()
  tenantDocumentType?: string;

  @ApiPropertyOptional({
    description: "Tenant document number",
    example: "9876543210",
  })
  @IsOptional()
  @IsString()
  tenantDocument?: string;

  @ApiPropertyOptional({
    description: "Tenant address",
    example: "Carrera 15 #8-40",
  })
  @IsOptional()
  @IsString()
  tenantAddress?: string;

  @ApiPropertyOptional({
    description: "Tenant legal representative",
    example: "Ana Gomez",
  })
  @IsOptional()
  @IsString()
  tenantLegalRepresentative?: string;

  @ApiPropertyOptional({
    description: "Cosigner full name",
    example: "Pedro Ruiz",
  })
  @IsOptional()
  @IsString()
  cosignerName?: string;

  @ApiPropertyOptional({
    description: "Cosigner document number",
    example: "1122334455",
  })
  @IsOptional()
  @IsString()
  cosignerDocument?: string;

  @ApiPropertyOptional({
    description: "Cosigner address",
    example: "Avenida 4 #12-05",
  })
  @IsOptional()
  @IsString()
  cosignerAddress?: string;

  @ApiPropertyOptional({
    description: "Cosigner email address",
    example: "cosigner@example.com",
  })
  @Transform(({ value }) => (value === "" ? undefined : value))
  @IsOptional()
  @IsEmail()
  cosignerEmail?: string;

  @ApiPropertyOptional({
    description: "Cosigner phone number",
    example: "+573001112233",
  })
  @IsOptional()
  @IsString()
  cosignerPhone?: string;

  @ApiPropertyOptional({
    description: "Contract duration",
    example: "12 meses",
  })
  @Transform(({ value }) =>
    value === undefined || value === null ? value : String(value),
  )
  @IsOptional()
  @IsString()
  duration?: string;

  @ApiPropertyOptional({
    description: "Monthly rent (canon)",
    example: 1500000,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  canon?: number;

  @ApiPropertyOptional({
    description: "Contract start date",
    example: "2026-01-01",
  })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiPropertyOptional({
    description: "Contract end date",
    example: "2026-12-31",
  })
  @IsOptional()
  @IsString()
  endDate?: string;

  @ApiPropertyOptional({
    description: "Property address",
    example: "Calle 50 #10-20",
  })
  @IsOptional()
  @IsString()
  placeAddress?: string;

  @ApiPropertyOptional({
    description: "Property municipality",
    example: "Barranquilla",
  })
  @IsOptional()
  @IsString()
  placeMunicipio?: string;

  @ApiPropertyOptional({
    description: "Property registration number",
    example: "080-123456",
  })
  @IsOptional()
  @IsString()
  registrationNumber?: string;

  @ApiProperty({
    description: "Whether the contract has been signed",
    example: false,
  })
  @Transform(({ value }) => value === true || value === "true")
  @IsOptional()
  @IsBoolean()
  hasSignature?: boolean;

  @ApiProperty({
    description: "Contract template ID to use",
    example: 1,
    type: Number,
  })
  @Transform(({ obj, value }) => value ?? obj.template_id)
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @IsInt()
  templateId: number;

  @ApiPropertyOptional({
    description: "Contract PDF file (optional)",
    type: "string",
    format: "binary",
  })
  @IsOptional()
  file?: Express.Multer.File;
}
