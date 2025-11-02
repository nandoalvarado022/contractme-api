import { Body, Controller, Get, Headers, Param, Post } from '@nestjs/common';
import { ContractService } from './contract.service';

@Controller('contracts')
export class ContractController {
  constructor(private contractService: ContractService) { }

  // @Get()
  // getUser(@Param('uid') uid: number) {
  //   return this.userService.getUser(null);
  // }
  
  @Get()
  getContracts(@Param('uid') uid: number) {
    return this.contractService.getContracts(uid);
  } 

  @Get('templates/:id?')
  getContractsTemplates(@Param('id') id?: number) {
    return this.contractService.getTemplates(id);
  } 

  @Post('generate')
  generateContract() {
    return this.contractService.generateContract();
  }
}
