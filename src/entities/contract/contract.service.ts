/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable } from '@nestjs/common';
import { ContractTemplateEntity } from './contract_templates.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { loginDto } from 'src/types/user';
import * as bcryptjs from 'bcryptjs'

var StatsD = require('hot-shots');
var dogstatsd = new StatsD();

@Injectable()
export class ContractService {
  constructor(
    @InjectRepository(ContractTemplateEntity)
    private contractTemplatesRepository: Repository<ContractTemplateEntity>,
  ) { }

  async getContracts(params = {}) {
    const contractsFound = await this.contractTemplatesRepository.find({
      where: params,
    });

    return contractsFound;
  }

  async getTemplates(id?: number) {
    const whereCondition = id ? { ct_id: id } : {};

    const start = Date.now();
    dogstatsd.increment('services.contract.getTemplates');

    try {
      const templates = await this.contractTemplatesRepository.find({
        where: whereCondition,
        relations: {
          fields: true,
        },
        order: {
          fields: {
            order: 'ASC',
          },
        },
      });

      const durationMs = Date.now() - start;
      dogstatsd.histogram('services.contract.getTemplates.duration', durationMs, [
        'repository:contract_templates',
        'operation:getTemplates',
        'status:success',
      ]);

      return (id)
        ? templates[0]
        : templates;
    } catch (error) {
      const durationMs = Date.now() - start;
      dogstatsd.histogram('services.contract.getTemplates.duration', durationMs, [
        'repository:contract_templates',
        'operation:getTemplates',
        'status:error',
      ]);
      throw error;
    }
  }
}
