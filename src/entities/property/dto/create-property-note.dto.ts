import { IsString, IsDateString, IsNumber } from "class-validator";

export class CreatePropertyNoteDto {
  @IsNumber()
  property_id: number;

  @IsString()
  text: string;
}
