import { Injectable } from "@nestjs/common";
import { ContractTemplateEntity } from "./contract_templates.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class ContractService {
  constructor(
    @InjectRepository(ContractTemplateEntity)
    private contractTemplatesRepository: Repository<ContractTemplateEntity>,
  ) {}

  async getContracts(params = {}) {
    const contractsFound = await this.contractTemplatesRepository.find({
      where: params,
    });

    return contractsFound;
  }

  async getTemplate(id: number) {
    const templates = await this.contractTemplatesRepository.find({
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

    return templates[0];
  }

  async getTemplates() {
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

    return templates;
  }
}
