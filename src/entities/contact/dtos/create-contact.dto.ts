import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { TypeContact } from '../contact.model';

export class CreateContactDto {
  @ApiProperty({
    description: "Contact person's full name",
    example: 'María González',
    maxLength: 100,
  })
  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({
    description: "Contact person's email address",
    example: 'maria.gonzalez@example.com',
    format: 'email',
    maxLength: 100,
  })
  @IsEmail()
  @MaxLength(100)
  @IsNotEmpty()
  email: string;

  @ApiPropertyOptional({
    description: "Contact person's phone number",
    example: '+1234567890',
    maxLength: 20,
  })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  phone: string;

  @ApiProperty({
    description: 'Reason for contact',
    enum: ['information', 'pricing', 'support', 'real-state', 'other'],
    example: 'information',
  })
  @IsNotEmpty()
  reason: TypeContact;

  @ApiProperty({
    description: 'Message or inquiry from the contact',
    example: 'I would like to know more about your services',
  })
  @IsString()
  @IsNotEmpty()
  message: string;
}
