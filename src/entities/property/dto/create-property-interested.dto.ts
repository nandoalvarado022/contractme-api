import { IsString, IsEmail, IsOptional, IsNumber } from "class-validator";

export class CreatePropertyInterestedDto {
  @IsString()
  name: string;

  @IsString()
  phone: string;

  @IsEmail()
  email: string;

  @IsNumber()
  @IsOptional()
  user_id?: number;
}
