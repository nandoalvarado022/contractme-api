import { Module } from "@nestjs/common";
import { ContractService } from "./contract.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ContractController } from "./contract.controller";
import { ContractTemplateEntity } from "./entities/contract_templates.entity";
import { ContractEntity } from "./entities/contract.entity";
import { ContractTemplateFieldsEntity } from "./entities/contract_templates_fields.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ContractEntity,
      ContractTemplateEntity,
      ContractTemplateFieldsEntity,
    ]),
  ],
  controllers: [ContractController],
  providers: [ContractService],
  exports: [ContractService],
})
export class ContractModule {}
