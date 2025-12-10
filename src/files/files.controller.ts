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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { ResponseMessage } from 'src/common/decorators';
import { FilesService } from './files.service';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  private readonly logger = new Logger(FilesController.name);

  constructor(private filesService: FilesService) {}

  @Post('saved/:uid')
  @UseInterceptors(FileInterceptor('file'))
  @ResponseMessage('Archivo subido exitosamente')
  @ApiOperation({
    summary: 'Upload file to S3',
    description:
      'Uploads a file to AWS S3 storage for a specific user. The file is stored in a user-specific folder with sanitized filename. Metadata including uploader ID, original filename, and upload date is automatically added.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiParam({
    name: 'uid',
    type: Number,
    description: 'User ID who is uploading the file',
    example: 1,
  })
  @ApiBody({
    description: 'File to upload',
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'File to upload (any type supported)',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'File uploaded successfully',
    schema: {
      example: {
        message: 'Archivo subido exitosamente',
        status: 'success',
        data: {
          path: 'files/saved/1/document.pdf',
          url: 'https://cdn.example.com/files/saved/1/document.pdf',
          originalName: 'document.pdf',
          size: 245680,
          mimetype: 'application/pdf',
          uploadedAt: '2025-12-09T10:00:00.000Z',
        },
        statusCode: 201,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - File is required or file is empty',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error - Failed to upload file to storage',
  })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Param('uid', ParseIntPipe) uid: number
  ) {
    this.logger.log(`File upload request for user ${uid}`);

    if (!file) {
      this.logger.warn('No file provided in upload request');
      throw new BadRequestException('File is required');
    }

    const result = await this.filesService.uploadFile(file, uid);
    this.logger.log(`File uploaded successfully for user ${uid}`);

    return {
      status: 'success',
      data: result,
      statusCode: HttpStatus.CREATED,
    };
  }

  @Delete(':uid/file/*')
  @ResponseMessage('Archivo eliminado exitosamente')
  @ApiOperation({
    summary: 'Delete file from S3',
    description:
      'Deletes a file from AWS S3 storage. Validates user ownership and file existence before deletion.',
  })
  @ApiParam({
    name: 'uid',
    type: Number,
    description: 'User ID who owns the file',
    example: 1,
  })
  @ApiParam({
    name: 'filePath',
    description:
      'Full path to the file in S3 (e.g., files/saved/1/document.pdf)',
    example: 'files/saved/1/document.pdf',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'File deleted successfully',
    schema: {
      example: {
        message: 'Archivo eliminado exitosamente',
        status: 'success',
        data: {
          message: 'File deleted successfully',
          filePath: 'files/saved/1/document.pdf',
        },
        statusCode: 200,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - File path is required',
  })
  @ApiResponse({
    status: 404,
    description: 'File not found or user not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error - Failed to delete file from storage',
  })
  async deleteFile(
    @Param('uid', ParseIntPipe) uid: number,
    @Param('*') filePath: string
  ) {
    this.logger.log(`File deletion request: ${filePath} for user ${uid}`);

    if (!filePath) {
      throw new BadRequestException('File path is required');
    }

    const result = await this.filesService.deleteFile(filePath, uid);
    this.logger.log(`File deleted successfully: ${filePath}`);

    return {
      status: 'success',
      data: result,
      statusCode: HttpStatus.OK,
    };
  }

  @Get(':uid/file/*')
  @ResponseMessage('Información del archivo obtenida exitosamente')
  @ApiOperation({
    summary: 'Get file information',
    description:
      'Retrieves detailed information about a file stored in S3, including metadata, size, content type, and last modified date.',
  })
  @ApiParam({
    name: 'uid',
    type: Number,
    description: 'User ID who owns the file',
    example: 1,
  })
  @ApiParam({
    name: 'filePath',
    description:
      'Full path to the file in S3 (e.g., files/saved/1/document.pdf)',
    example: 'files/saved/1/document.pdf',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'File information retrieved successfully',
    schema: {
      example: {
        message: 'Información del archivo obtenida exitosamente',
        status: 'success',
        data: {
          path: 'files/saved/1/document.pdf',
          url: 'https://cdn.example.com/files/saved/1/document.pdf',
          size: 245680,
          lastModified: '2025-12-09T10:00:00.000Z',
          contentType: 'application/pdf',
          metadata: {
            'uploaded-by': '1',
            'original-name': 'document.pdf',
            'upload-date': '2025-12-09T10:00:00.000Z',
          },
        },
        statusCode: 200,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - File path is required',
  })
  @ApiResponse({
    status: 404,
    description: 'File not found or user not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error - Failed to retrieve file information',
  })
  async getFileInfo(
    @Param('uid', ParseIntPipe) uid: number,
    @Param('*') filePath: string
  ) {
    this.logger.log(`File info request: ${filePath} for user ${uid}`);

    if (!filePath) {
      throw new BadRequestException('File path is required');
    }

    const result = await this.filesService.getFileInfo(filePath, uid);
    this.logger.log(`File info retrieved successfully: ${filePath}`);

    return {
      status: 'success',
      data: result,
      statusCode: HttpStatus.OK,
    };
  }
}
