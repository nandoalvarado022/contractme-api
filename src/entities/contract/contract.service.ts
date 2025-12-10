import { Injectable, NotFoundException } from "@nestjs/common";
import { ContractTemplateEntity } from "./entities/contract_templates.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ContractEntity } from "./entities/contract.entity";
import { GenerateContractDto } from "./dtos/generate-contract.dto";
import { NotFoundError } from "rxjs";

@Injectable()
export class ContractService {
  constructor(
    @InjectRepository(ContractTemplateEntity)
    private contractTemplatesRepository: Repository<ContractTemplateEntity>,
    @InjectRepository(ContractEntity)
    private contractsRepository: Repository<ContractEntity>,
  ) {}

  async generateOne(generateContractDto: GenerateContractDto, url: string) {
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
          order: "ASC",
        },
      },
    });
    if (!template) throw new NotFoundException("Contract template not found");
    return template;
  }

  async getAllTemplates() {
    const templates = await this.contractTemplatesRepository.find({
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
