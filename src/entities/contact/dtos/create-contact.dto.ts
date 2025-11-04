import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";
import { TypeContact } from "../contact.model";

export class CreateContactDto {
  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  fullName: string;

  @IsEmail()
  @MaxLength(100)
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  phone: string;

  @IsNotEmpty()
  reason: TypeContact;

  @IsString()
  @IsNotEmpty()
  message: string;
}
