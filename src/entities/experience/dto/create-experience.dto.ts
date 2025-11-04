import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsNumber,
} from "class-validator"

export class CreateExperienceDto {
  @IsString()
  @IsNotEmpty()
  company: string

  @IsString()
  @IsNotEmpty()
  position: string

  @IsDateString()
  @IsNotEmpty()
  start_date: string

  @IsDateString()
  @IsOptional()
  end_date?: string

  @IsNumber()
  @IsOptional()
  uid?: number
}
