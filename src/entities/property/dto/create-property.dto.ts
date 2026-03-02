import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsArray } from 'class-validator';
import { CreatePropertyNoteDto } from './create-property-note.dto';
import { CreatePropertyInterestedDto } from './create-property-interested.dto';

export class CreatePropertyDto {
  @ApiProperty({
    description: 'City where the property is located',
    example: 'Miami',
  })
  @IsString()
  city: string;

  @ApiProperty({
    description: 'Property address',
    example: '123 Main Street',
  })
  @IsString()
  address: string;

  @ApiPropertyOptional({
    description: 'Property image URL',
    example: 'https://example.com/property.jpg',
  })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiProperty({
    description: 'Property price',
    example: 250000,
    type: Number,
  })
  @IsNumber()
  price: number;

  @ApiProperty({
    description: 'Type of property',
    example: 'apartment',
    enum: ['apartment', 'house', 'condo', 'commercial'],
  })
  @IsString()
  type: PROPERTY_TYPE;

  @ApiProperty({
    description: 'Operation type',
    example: 'sale',
    enum: ['sale', 'rent'],
  })
  @IsString()
  operation_type: OPERATION_TYPE;

  @ApiProperty({
    description: 'Number of bedrooms',
    example: 3,
    type: Number,
  })
  @IsNumber()
  bedrooms: number;

  @ApiProperty({
    description: 'Number of bathrooms',
    example: 2,
    type: Number,
  })
  @IsNumber()
  bathrooms: number;

  @ApiProperty({
    description: 'Property area in square meters',
    example: 120.5,
    type: Number,
  })
  @IsNumber()
  area: number;

  @ApiProperty({
    description: 'Property description',
    example: 'Beautiful apartment with ocean view',
  })
  @IsString()
  description: string;

  @ApiPropertyOptional({
    description: 'Owner user ID (auto-set from authenticated user)',
    example: 1,
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  owner_uid?: number;

  @ApiPropertyOptional({
    description: 'Property notes',
    type: [CreatePropertyNoteDto],
    isArray: true,
  })
  @IsArray()
  @IsOptional()
  notes?: CreatePropertyNoteDto[];

  @ApiPropertyOptional({
    description: 'Interested parties',
    type: [CreatePropertyInterestedDto],
    isArray: true,
  })
  @IsArray()
  @IsOptional()
  interested?: CreatePropertyInterestedDto[];
}
