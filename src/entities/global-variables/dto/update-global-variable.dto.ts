import { PartialType } from '@nestjs/swagger';
import { CreateGlobalVariableDto } from './create-global-variable.dto';

export class UpdateGlobalVariableDto extends PartialType(
  CreateGlobalVariableDto,
) {}
