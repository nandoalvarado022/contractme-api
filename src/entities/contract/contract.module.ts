import { Module } from "@nestjs/common";
import { ContractService } from "./contract.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ContractController } from "./contract.controller";
import { ContractTemplateEntity } from "./entities/contract_templates.entity";
import { ContractEntity } from "./entities/contract.entity";
import { ContractTemplateFieldsEntity } from "./entities/contract_templates_fields.entity";
import { FilesModule } from "src/files/files.module";
import { TransactionModule } from "../transactions/transactions.module";
import { GlobalVariablesModule } from "../global-variables/global-variables.module";
import { MailModule } from "src/common/emails/mail.module";

@Module({
  imports: [
    FilesModule,
    TransactionModule,
    GlobalVariablesModule,
    MailModule,
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
