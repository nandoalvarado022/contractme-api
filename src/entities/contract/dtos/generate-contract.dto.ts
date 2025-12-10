import { Type } from "class-transformer";
import {
  IsBoolean,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from "class-validator";

export class GenerateContractDto {
  @IsString()
  @IsNotEmpty()
  tennatName: string;

  @IsEmail()
  @IsNotEmpty()
  tennatEmail: string;

  @IsString()
  @IsNotEmpty()
  tennatPhone: string;

  @IsString()
  @IsNotEmpty()
  lessorName: string;

  @IsEmail()
  @IsNotEmpty()
  lessorEmail: string;

  @IsString()
  @IsNotEmpty()
  lessorPhone: string;

  @IsBoolean()
  @IsNotEmpty()
  hasSignature: boolean;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @IsInt()
  @Type(() => Number)
  templateId: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @IsInt()
  @Type(() => Number)
  uid: number;
}
