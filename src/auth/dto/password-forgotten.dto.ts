import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class PasswordForgottenDto {
  @ApiProperty({
    description: "User's email address to send temporary password",
    example: "juan.perez@example.com",
    format: "email",
  })
  @IsEmail()
  email: string;
}
