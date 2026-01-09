import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, isString, IsString, MinLength } from "class-validator";

export class RegisterDto {
  @ApiProperty({
    description: "User name",
    example: "Juan",
    minLength: 1,
  })
  @IsString()
  @MinLength(1)
  name: string;
  
  @ApiProperty({
    description: "User last name",
    example: "Perez",
    minLength: 1,
  })
  @IsString()
  @MinLength(1)
  lastName: string;

  @ApiProperty({
    description: "User's email address",
    example: "juan.perez@example.com",
    format: "email",
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "User's password (minimum 6 characters)",
    example: "SecurePass123",
    minLength: 6,
  })
  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(6)
  password: string;
}
