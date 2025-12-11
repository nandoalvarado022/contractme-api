import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateReferenceDto {
  @ApiProperty({
    description: "Reference person's full name",
    example: "María García",
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    description: "Reference person's phone number",
    example: "+1234567890",
    maxLength: 15,
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({
    description: "Relationship with the reference person",
    example: "Former supervisor",
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  relationship: string;

  @ApiPropertyOptional({
    description: "User ID associated with this reference",
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  uid?: number;
}
