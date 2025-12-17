import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateGlobalVariableDto {
  @ApiProperty({
    description: 'Variable key/name',
    example: 'MAINTENANCE_MODE',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  key: string;

  @ApiProperty({
    description: 'Variable value',
    example: 'false',
  })
  @IsString()
  @IsNotEmpty()
  value: string;
}
