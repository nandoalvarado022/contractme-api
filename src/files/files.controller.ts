import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Delete,
  UploadedFile,
  UseInterceptors,
  HttpStatus,
  Logger,
  BadRequestException,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Express } from "express";
import { ResponseMessage } from "src/common/decorators";
import { FilesService } from "./files.service";

@Controller("files")
export class FilesController {
  private readonly logger = new Logger(FilesController.name);

  constructor(private filesService: FilesService) {}

  @Post("saved/:uid")
  @UseInterceptors(FileInterceptor("file"))
  @ResponseMessage("Archivo subido exitosamente")
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Param("uid", ParseIntPipe) uid: number,
  ) {
    this.logger.log(`File upload request for user ${uid}`);

    if (!file) {
      this.logger.warn("No file provided in upload request");
      throw new BadRequestException("File is required");
    }

    const result = await this.filesService.uploadFile(file, uid);
    this.logger.log(`File uploaded successfully for user ${uid}`);

    return {
      status: "success",
      data: result,
      statusCode: HttpStatus.CREATED,
    };
  }

  @Delete(":uid/file/*")
  @ResponseMessage("Archivo eliminado exitosamente")
  async deleteFile(
    @Param("uid", ParseIntPipe) uid: number,
    @Param("*") filePath: string,
  ) {
    this.logger.log(`File deletion request: ${filePath} for user ${uid}`);

    if (!filePath) {
      throw new BadRequestException("File path is required");
    }

    const result = await this.filesService.deleteFile(filePath, uid);
    this.logger.log(`File deleted successfully: ${filePath}`);

    return {
      status: "success",
      data: result,
      statusCode: HttpStatus.OK,
    };
  }

  @Get(":uid/file/*")
  @ResponseMessage("Información del archivo obtenida exitosamente")
  async getFileInfo(
    @Param("uid", ParseIntPipe) uid: number,
    @Param("*") filePath: string,
  ) {
    this.logger.log(`File info request: ${filePath} for user ${uid}`);

    if (!filePath) {
      throw new BadRequestException("File path is required");
    }

    const result = await this.filesService.getFileInfo(filePath, uid);
    this.logger.log(`File info retrieved successfully: ${filePath}`);

    return {
      status: "success",
      data: result,
      statusCode: HttpStatus.OK,
    };
  }
}
