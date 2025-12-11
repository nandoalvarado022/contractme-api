import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsEmail, IsOptional, IsNumber } from "class-validator";

export class CreatePropertyInterestedDto {
  @ApiProperty({
    description: "Interested person's name",
    example: "Carlos López",
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: "Interested person's phone",
    example: "+1234567890",
  })
  @IsString()
  phone: string;

  @ApiProperty({
    description: "Interested person's email",
    example: "carlos.lopez@example.com",
    format: "email",
  })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    description: "User ID if the interested person is a registered user",
    example: 5,
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  user_id?: number;
}
