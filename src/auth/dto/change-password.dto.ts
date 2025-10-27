import { Transform } from 'class-transformer';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsEmail()
  email: string;

  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(6)
  currentPassword: string;

  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(6)
  newPassword: string;
}
