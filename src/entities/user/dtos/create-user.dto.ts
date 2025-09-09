import { IsString, IsNotEmpty, IsOptional, IsEmail, IsEnum, IsNumber, IsDate, IsDateString } from 'class-validator'
import { Role } from 'src/common/enums/rol.enum'
import { CreateEducationDto } from 'src/entities/education/dto'
import { CreateExperienceDto } from 'src/entities/experience/dto'
import { DocumentType } from 'src/common/enums/document-type'
import { CreateReferenceDto } from 'src/entities/reference/dto/create-reference.dto'

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name: string

  @IsString()
  @IsOptional()
  last_name?: string

  @IsEmail()
  @IsNotEmpty()
  @IsOptional()
  email: string

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  password: string

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  phone: string

  @IsEnum(DocumentType)
  @IsNotEmpty()
  document_type: DocumentType

  @IsNumber()
  @IsNotEmpty()
  document_number: number

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  picture: string

  @IsDateString()
  @IsNotEmpty()
  @IsOptional()
  birth_date: string

  @IsEnum(Role)
  @IsNotEmpty()
  @IsOptional()
  role: Role

  @IsOptional()
  education?: CreateEducationDto[]

  @IsOptional()
  experience?: CreateExperienceDto[]

  @IsOptional()
  reference?: CreateReferenceDto[]
}