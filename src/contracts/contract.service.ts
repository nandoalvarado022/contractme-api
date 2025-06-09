/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable } from '@nestjs/common';
import { ContractTemplateEntity } from './contract_templates.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { loginDto } from 'src/types/user';
import * as bcryptjs from 'bcryptjs'
import { StudiesAndExperiencesEntity } from 'src/experience/experience.entity';

@Injectable()
export class ContractService {
  constructor(
    @InjectRepository(ContractTemplateEntity)
    private contractRepository: Repository<ContractTemplateEntity>,
  ) { }

  async getContracts(params = {}) {
    const contractsFound = await this.contractRepository.find({
      where: params,
    });

    return contractsFound;
  }
}
