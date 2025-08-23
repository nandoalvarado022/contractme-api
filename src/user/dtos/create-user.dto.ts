import { IsString, IsNotEmpty, IsOptional, IsEmail, IsEnum, IsNumber, IsDate, IsDateString } from 'class-validator'
import { Role } from 'src/common/enums/rol.enum'
import { CreateEducationDto } from 'src/education/dto'
import { CreateExperienceDto } from 'src/experience/dto'
import { DocumentType } from 'src/common/enums/document-type'
import { CreateReferenceDto } from 'src/reference/dto/create-reference.dto'

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsOptional()
  last_name?: string

  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsString()
  @IsNotEmpty()
  password: string

  @IsString()
  @IsNotEmpty()
  phone: string

  @IsEnum(DocumentType)
  @IsNotEmpty()
  document_type: DocumentType

  @IsNumber()
  @IsNotEmpty()
  document_number: number

  @IsString()
  @IsNotEmpty()
  picture: string

  @IsDateString()
  @IsNotEmpty()
  birth_date: string

  @IsEnum(Role)
  @IsNotEmpty()
  role: Role

  @IsOptional()
  formation?: CreateEducationDto[]

  @IsOptional()
  experience?: CreateExperienceDto[]

  @IsOptional()
  reference?: CreateReferenceDto[]
}