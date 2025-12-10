import {
  Body,
  Controller,
  Get,
  Param,
  UploadedFiles,
  UseInterceptors,
  ParseIntPipe,
  Post,
} from "@nestjs/common";
import { ContractService } from "./contract.service";
import { GenerateContractDto } from "./dtos/generate-contract.dto";
import { ResponseMessage } from "src/common/decorators";
import { FileInterceptor } from "@nestjs/platform-express";
import { FilesService } from "src/files/files.service";

@Controller("contracts")
export class ContractController {
  constructor(
    private readonly contractService: ContractService,
    private readonly filesService: FilesService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor("file"))
  @ResponseMessage("Contrato generado exitosamente")
  async generateContract(
    @Body() generateContractDto: GenerateContractDto,
    @UploadedFiles() file: Express.Multer.File,
  ) {
    const { url } = await this.filesService.uploadFile(
      file,
      generateContractDto.uid,
    );
    return this.contractService.generateOne(generateContractDto, url);
  }

  @Get("templates/:id")
  @ResponseMessage("El template del contrato se ha recuperado con éxito")
  getContractsTemplate(@Param("id", ParseIntPipe) id: number) {
    return this.contractService.getOneTemplate(id);
  }

  @Get("templates")
  @ResponseMessage("Los templates de contratos se han recuperado con éxito")
  getContractsTemplates() {
    return this.contractService.getAllTemplates();
  }
}
