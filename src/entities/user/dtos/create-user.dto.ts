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
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  password: string;

  @IsString()
  @IsOptional()
  phone: string;

  @IsEnum(DocumentType)
  document_type: DocumentType;

  @IsNumber()
  document_number: number;

  @IsString()
  @IsOptional()
  picture: string;

  @IsOptional()
  birth_date: string;

  @IsEnum(Role)
  @IsOptional()
  role: Role;

  @IsOptional()
  education?: CreateEducationDto[];

  @IsOptional()
  experience?: CreateExperienceDto[];

  @IsOptional()
  reference?: CreateReferenceDto[];
}
