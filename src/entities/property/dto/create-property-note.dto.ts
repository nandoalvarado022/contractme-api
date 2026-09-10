import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsDateString, IsNumber } from "class-validator";

export class CreatePropertyNoteDto {
  @ApiProperty({
    description: "Property ID",
    example: 1,
    type: Number,
  })
  @IsNumber()
  propertyId: number;

  @ApiProperty({
    description: "Note text content",
    example: "Property needs minor repairs",
  })
  @IsString()
  text: string;
}
