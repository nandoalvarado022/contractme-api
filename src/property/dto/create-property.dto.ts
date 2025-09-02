import { IsString, IsNumber, IsOptional, IsArray } from "class-validator"
import { CreatePropertyNoteDto } from "./create-property-note.dto"
import { CreatePropertyInterestedDto } from "./create-property-interested.dto"

export class CreatePropertyDto {
  @IsString()
  city: string

  @IsString()
  address: string

  @IsString()
  @IsOptional()
  image?: string

  @IsNumber()
  price: number

  @IsString()
  type: PROPERTY_TYPE

  @IsString()
  operation_type: OPERATION_TYPE

  @IsNumber()
  bedrooms: number

  @IsNumber()
  bathrooms: number

  @IsNumber()
  area: number

  @IsString()
  description: string

  @IsNumber()
  owner_uid: number

  @IsArray()
  @IsOptional()
  notes?: CreatePropertyNoteDto[]

  @IsArray()
  @IsOptional()
  interested?: CreatePropertyInterestedDto[]
}
