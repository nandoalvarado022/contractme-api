import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"

export class CreateReferenceDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsOptional()
  phone?: string

  @IsString()
  @IsNotEmpty()
  relationship: string

  @IsNumber()
  @IsOptional()
  uid?: number
}
