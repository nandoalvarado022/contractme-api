import { IsString, IsNotEmpty, IsOptional, IsEmail, IsEnum, IsNumber } from 'class-validator'
import { Role } from 'src/common/enums/rol.enum'
import { CreateEducationDto } from 'src/education/dto'
import { CreateExperienceDto } from 'src/experience/dto'

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
  @IsOptional()
  phone?: string

  @IsString()
  @IsOptional()
  document_type?: string

  @IsNumber()
  @IsOptional()
  document_number?: number

  @IsString()
  @IsOptional()
  picture?: string

  @IsString()
  @IsOptional()
  birth_date?: string

  @IsEnum(Role)
  @IsOptional()
  role?: Role

  @IsNumber()
  @IsOptional()
  uid?: number

  @IsOptional()
  formation?: CreateEducationDto[]

  @IsOptional()
  experience?: CreateExperienceDto[]
}