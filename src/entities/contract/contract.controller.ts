import {
  Body,
  Controller,
  Get,
  Param,
  UploadedFile,
  UseInterceptors,
  ParseIntPipe,
  Post,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ContractService } from "./contract.service";
import { GenerateContractDto } from "./dtos/generate-contract.dto";
import { ResponseMessage, UserId } from "src/common/decorators";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiGenerateContract,
  ApiGetContractTemplate,
  ApiGetContractTemplates,
} from "./contract.docs";

@ApiTags("Contracts")
@Controller("contracts")
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @Post()
  @UseInterceptors(FileInterceptor("file"))
  @ResponseMessage("Contrato generado exitosamente")
  @ApiGenerateContract()
  async generateContract(
    @Body() generateContractDto: GenerateContractDto,
    @UploadedFile() file: Express.Multer.File | undefined,
    @UserId() uid: number,
  ) {
    console.log(file);
    return this.contractService.generateOne(generateContractDto, file, uid);
  }

  @Get("templates/:id")
  @ResponseMessage("El template del contrato se ha recuperado con éxito")
  @ApiGetContractTemplate()
  getContractsTemplate(@Param("id", ParseIntPipe) id: number) {
    return this.contractService.getOneTemplate(id);
  }

  @Get("templates")
  @ResponseMessage("Los templates de contratos se han recuperado con éxito")
  @ApiGetContractTemplates()
  getContractsTemplates() {
    return this.contractService.getAllTemplates();
  }
}
