import { Module } from '@nestjs/common';
import { ContractService } from './contract.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContractController } from './contract.controller';
import { StudiesAndExperiencesEntity } from 'src/experience/experience.entity';
import { ContractTemplateEntity } from './contract_templates.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ContractTemplateEntity,
    ])],
  controllers: [ContractController],
  providers: [ContractService],
  exports: [ContractService],
})
export class ContractModule {}
