import { IsString, IsNotEmpty, IsOptional, IsNumber } from "class-validator"

export class CreateExperienceDto {
  @IsString()
  @IsNotEmpty()
  company: string

  @IsString()
  @IsNotEmpty()
  position: string

  @IsString()
  @IsNotEmpty()
  start_date: string

  @IsString()
  @IsOptional()
  end_date?: string

  @IsNumber()
  @IsOptional()
  user_id?: number
}
