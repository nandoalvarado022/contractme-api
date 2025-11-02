/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable } from '@nestjs/common';
import { ContractTemplateEntity } from './contract_templates.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { loginDto } from 'src/types/user';
import * as bcryptjs from 'bcryptjs'
import { UserService } from 'src/entities/user/user.service';

var StatsD = require('hot-shots');
var dogstatsd = new StatsD();

@Injectable()
export class ContractService {
  constructor(
    @InjectRepository(ContractTemplateEntity)
    private contractTemplatesRepository: Repository<ContractTemplateEntity>,
    private userService: UserService,
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
    dogstatsd.increment('services', [
      'service:contract',
      'action:getTemplates',
    ]);

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
      dogstatsd.histogram('services.duration', durationMs, [
        'status:success',
        'service:contract',
        'action:getTemplates',
      ]);

      return (id)
        ? templates[0]
        : templates;
    } catch (error) {
      const durationMs = Date.now() - start;
      dogstatsd.histogram('services.duration', durationMs, [
        'status:error',
        'service:contract',
        'action:getTemplates',
      ]);
      throw error;
    }
  }

  async generateContract(id?: number) {
    const start = Date.now();
    dogstatsd.increment('services', [
      'service:contract',
      'action:generateContract',
    ]);

    try {
      const params = id ? { uid: id } : {};
      const creditsResp = this.userService.getCredits(params);

      if (creditsResp.data.credits < 1) {
        dogstatsd.increment('services', [
          'service:contract',
          'action:generateContract',
          'status:error',
          'reason:insufficient_credits',
        ]);
      }

      const durationMs = Date.now() - start;
      dogstatsd.increment('services', [
        'status:success',
        'service:contract',
        'action:generateContract',
      ]);
      dogstatsd.histogram('services.duration', durationMs, [
        'status:success',
        'service:contract',
        'action:generateContract',
      ]);

      return creditsResp;
    } catch (error) {
      const durationMs = Date.now() - start;
      dogstatsd.increment('services', [
        'status:error',
        'service:contract',
        'action:generateContract',
      ]);
      dogstatsd.histogram('services.duration', durationMs, [
        'status:error',
        'service:contract',
        'action:generateContract',
      ]);
      throw error;
    }
  }  
}
