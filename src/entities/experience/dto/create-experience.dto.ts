import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsNumber,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateExperienceDto {
  @ApiProperty({
    description: "Company name where the user worked",
    example: "Tech Solutions Inc.",
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  company: string;

  @ApiProperty({
    description: "Position or job title",
    example: "Senior Software Developer",
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  position: string;

  @ApiProperty({
    description: "Start date of the experience (ISO 8601 format)",
    example: "2020-01-15T00:00:00.000Z",
  })
  @IsDateString()
  @IsNotEmpty()
  start_date: string;

  @ApiPropertyOptional({
    description:
      "End date of the experience (ISO 8601 format). Leave empty if currently working",
    example: "2023-06-30T00:00:00.000Z",
  })
  @IsDateString()
  @IsOptional()
  end_date?: string;

  @ApiPropertyOptional({
    description: "User ID associated with this experience",
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  uid?: number;
}
