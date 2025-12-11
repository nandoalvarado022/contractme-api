import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsNumber,
} from "class-validator";

export class CreateEducationDto {
  @ApiProperty({
    description: "Educational institution name",
    example: "Universidad de Miami",
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  place: string;

  @ApiProperty({
    description: "Degree or certification title",
    example: "Bachelor of Computer Science",
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: "Start date of the education (ISO 8601 format)",
    example: "2018-09-01T00:00:00.000Z",
  })
  @IsDateString()
  @IsNotEmpty()
  start_date: string;

  @ApiPropertyOptional({
    description:
      "End date of the education (ISO 8601 format). Leave empty if currently studying",
    example: "2022-06-15T00:00:00.000Z",
  })
  @IsDateString()
  @IsOptional()
  end_date?: string;

  @ApiPropertyOptional({
    description: "User ID associated with this education record",
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  uid?: number;
}
