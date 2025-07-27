import { IsString, IsNumber, IsOptional, IsArray } from "class-validator"
import { CreatePropertyNoteDto } from "./create-property-note.dto"
import { CreatePropertyInterestedDto } from "./create-property-interested.dto"

export class CreatePropertyDto {
  @IsString()
  city: string

  @IsString()
  address: string

  @IsString()
  searchBy: string

  @IsString()
  @IsOptional()
  image?: string

  @IsNumber()
  price: number

  @IsString()
  type: string

  @IsNumber()
  bedrooms: number

  @IsNumber()
  bathrooms: number

  @IsNumber()
  area: number

  @IsString()
  description: string

  @IsNumber()
  owner_id: number

  @IsNumber()
  @IsOptional()
  tenant_id?: number

  @IsArray()
  @IsOptional()
  notes?: CreatePropertyNoteDto[]

  @IsArray()
  @IsOptional()
  interested?: CreatePropertyInterestedDto[]
}
