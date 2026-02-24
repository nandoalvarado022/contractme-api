import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsEnum,
  IsNumber,
  IsDate,
  IsDateString,
} from "class-validator";
import { Role } from "src/common/enums/rol.enum";
import { CreateEducationDto } from "src/entities/education/dto";
import { CreateExperienceDto } from "src/entities/experience/dto";
import { DocumentType } from "src/common/enums/document-type";
import { CreateReferenceDto } from "src/entities/reference/dto/create-reference.dto";

export class CreateUserDto {
  @ApiProperty({
    description: "User name",
    example: "John",
    required: false,
  })
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  lastname: string;

  @ApiProperty({
    description: "User email address",
    example: "john@example.com",
    required: false,
  })
  @IsString()
  @IsOptional()
  @IsEmail()
  @IsOptional()
  email: string;

  @ApiProperty({
    description: "User password (default: 'contractme')",
    example: "securePassword123",
    required: false,
  })
  @IsString()
  @IsOptional()
  password: string;

  @ApiProperty({
    description: "User phone number",
    example: "+1234567890",
    required: false,
  })
  @IsString()
  @IsOptional()
  phone: string;

  @ApiProperty({
    description: "Document type",
    enum: DocumentType,
    example: DocumentType.CC,
  })
  @IsEnum(DocumentType)
  document_type: DocumentType;

  @ApiProperty({
    description: "Document number",
    example: "123456789",
  })
  @IsString()
  document_number: string;

  @ApiProperty({
    description: "Profile picture URL",
    example: "https://example.com/pic.jpg",
    required: false,
  })
  @IsString()
  @IsOptional()
  picture: string;

  @ApiProperty({
    description: "Birth date in ISO format",
    example: "1990-01-01",
    required: false,
  })
  @IsOptional()
  birth_date: string;

  @ApiProperty({
    description: "User role",
    enum: Role,
    default: Role.USER,
    example: Role.USER,
    required: false,
  })
  @IsEnum(Role)
  @IsOptional()
  role: Role;

  @ApiProperty({
    description: "User education records",
    type: [CreateEducationDto],
    required: false,
  })
  @IsOptional()
  education?: CreateEducationDto[];

  @ApiProperty({
    description: "User work experience records",
    type: [CreateExperienceDto],
    required: false,
  })
  @IsOptional()
  experience?: CreateExperienceDto[];

  @ApiProperty({
    description: "User references",
    type: [CreateReferenceDto],
    required: false,
  })
  @IsOptional()
  reference?: CreateReferenceDto[];
}
