import { Injectable, NotFoundException } from "@nestjs/common";
import { ContractTemplateEntity } from "./entities/contract_templates.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ContractEntity } from "./entities/contract.entity";
import { GenerateContractDto } from "./dtos/generate-contract.dto";
import { TransactionsService } from "../transactions/transaction.service";
import { TRANSACTION_TYPE } from "../transactions/consts/transactions.const";
import { GlobalVariablesService } from "../global-variables/global-variables.service";
import { STATUS_CONTRACT } from "./consts/contract.consts";
import { MailService } from "src/common/emails/mail.service";

@Injectable()
export class ContractService {
  private readonly EMAIL_NOTIFCATION_SIGNATURE = 'gabrielacharrisr@gmail.com';

  constructor(
    @InjectRepository(ContractTemplateEntity)
    private contractTemplatesRepository: Repository<ContractTemplateEntity>,
    @InjectRepository(ContractEntity)
    private contractsRepository: Repository<ContractEntity>,
    private readonly transactionsService: TransactionsService,
    private readonly globalVariablesService: GlobalVariablesService,
    private readonly emailService: MailService,
  ) {}

  async generateOne(
    generateContractDto: GenerateContractDto,
    url: string | null,
    uid: number,
  ) {
    const costVariable = await this.globalVariablesService.findByKey(
      "contract_generation_cost",
    );
    const amount = parseInt(costVariable.value, 10);

    await this.transactionsService.createTransaction({
      uid,
      concept: "Generación de contrato",
      amount,
      type: TRANSACTION_TYPE.REMOVE,
    });

    if (generateContractDto.hasSignature) {
      this.emailService.sendEmailBrevo(
        this.EMAIL_NOTIFCATION_SIGNATURE,
        'Admin',
        'new_generation_contract_with_signature',
        {
          tennatName: generateContractDto.tennatName ?? 'No especificado',
          tennatEmail: generateContractDto.tennatEmail ?? 'No especificado',
          tennatPhone: generateContractDto.tennatPhone ?? 'No especificado',
          lessorName: generateContractDto.lessorName ?? 'No especificado',
          lessorEmail: generateContractDto.lessorEmail ?? 'No especificado',
          lessorPhone: generateContractDto.lessorPhone ?? 'No especificado',
          templateId: String(generateContractDto.templateId ?? 'N/A'),
          date: new Date().toLocaleDateString('es-CO', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          }),
        },
      ).catch((err) => console.error('Error sending contract signature email:', err));
    }

    const contract = this.contractsRepository.create({
      url: url ?? undefined,
      ...generateContractDto,
    });
    return await this.contractsRepository.save(contract);
  }

  async getOneTemplate(id: number) {
    const template = await this.contractTemplatesRepository.findOne({
      where: { ct_id: id, status: STATUS_CONTRACT.ACTIVE },
      relations: {
        fields: true,
      },
      order: {
        fields: {
          order: "ASC",
        },
      },
    });
    if (!template) throw new NotFoundException("Contract template not found");
    return template;
  }

  async getAllTemplates() {
    const templates = await this.contractTemplatesRepository.find({
      where: { status: STATUS_CONTRACT.ACTIVE },
      relations: {
        fields: true,
      },
      order: {
        fields: {
          order: "ASC",
        },
      },
    });

    if (templates.length === 0)
      throw new NotFoundException("No contract templates found");

    return templates;
  }
}
