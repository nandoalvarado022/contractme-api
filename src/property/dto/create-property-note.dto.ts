import { IsString, IsDateString } from "class-validator"

export class CreatePropertyNoteDto {
  @IsString()
  text: string

  @IsDateString()
  date: string
}
