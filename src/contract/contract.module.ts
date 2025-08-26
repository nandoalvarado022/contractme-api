import { Module } from '@nestjs/common';
import { ContractService } from './contract.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContractController } from './contract.controller';
import { ContractTemplateEntity } from './contract_templates.entity';
import { ContractEntity } from './contract.entity';
import { ContractFieldsEntity } from './contract_fields.entity';
import { ContractTemplateFieldsEntity } from './contract_templates_fields.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ContractEntity,
      ContractFieldsEntity,
      ContractTemplateEntity,
      ContractTemplateFieldsEntity,
    ])],
  controllers: [ContractController],
  providers: [ContractService],
  exports: [ContractService],
})

export class ContractModule {}
