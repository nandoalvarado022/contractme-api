import { Injectable, NotFoundException } from '@nestjs/common';
import { ContractTemplateEntity } from './entities/contract_templates.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ContractEntity } from './entities/contract.entity';
import { GenerateContractDto } from './dtos/generate-contract.dto';
import { TransactionsService } from '../transactions/transaction.service';
import { TRANSACTION_TYPE } from '../transactions/consts/transactions.const';
import { GlobalVariablesService } from '../global-variables/global-variables.service';

@Injectable()
export class ContractService {
  constructor(
    @InjectRepository(ContractTemplateEntity)
    private contractTemplatesRepository: Repository<ContractTemplateEntity>,
    @InjectRepository(ContractEntity)
    private contractsRepository: Repository<ContractEntity>,
    private readonly transactionsService: TransactionsService,
    private readonly globalVariablesService: GlobalVariablesService
  ) {}

  async generateOne(
    generateContractDto: GenerateContractDto,
    url: string,
    uid: number
  ) {
    const costVariable = await this.globalVariablesService.findByKey(
      'contract_generation_cost'
    );
    const amount = parseInt(costVariable.value, 10);

    await this.transactionsService.createTransaction({
      uid,
      concept: 'Generación de contrato',
      amount,
      type: TRANSACTION_TYPE.REMOVE,
    });

    const contract = this.contractsRepository.create({
      url,
      ...generateContractDto,
    });
    return await this.contractsRepository.save(contract);
  }

  async getOneTemplate(id: number) {
    const template = await this.contractTemplatesRepository.findOne({
      where: { ct_id: id },
      relations: {
        fields: true,
      },
      order: {
        fields: {
          order: 'ASC',
        },
      },
    });
    if (!template) throw new NotFoundException('Contract template not found');
    return template;
  }

  async getAllTemplates() {
    const templates = await this.contractTemplatesRepository.find({
      relations: {
        fields: true,
      },
      order: {
        fields: {
          order: 'ASC',
        },
      },
    });

    if (templates.length === 0)
      throw new NotFoundException('No contract templates found');

    return templates;
  }
}
