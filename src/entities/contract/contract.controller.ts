import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { ContractService } from "./contract.service";

@Controller("contracts")
export class ContractController {
  constructor(private contractService: ContractService) {}

  @Get(":uid")
  getContracts(@Param("uid", ParseIntPipe) uid: number) {
    return this.contractService.getContracts(uid);
  }

  @Get("templates/:id")
  getContractsTemplate(@Param("id", ParseIntPipe) id: number) {
    return this.contractService.getTemplate(id);
  }

  @Get("templates")
  getContractsTemplates() {
    return this.contractService.getTemplates();
  }
}
