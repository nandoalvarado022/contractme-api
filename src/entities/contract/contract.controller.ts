import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { ResponseMessage, UserId } from "src/common/decorators";
import { FilesService } from "src/files/files.service";
import { ContractService } from "./contract.service";
import { GenerateContractDto } from "./dtos/generate-contract.dto";

@ApiTags("Contracts")
@Controller("contracts")
export class ContractController {
  constructor(
    private readonly contractService: ContractService,
    private readonly filesService: FilesService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor("file"))
  @ResponseMessage("Contrato generado exitosamente")
  @ApiOperation({
    summary: "Generate new contract",
    description:
      "Generates a new contract from a template, uploads the contract file, and stores contract information with tenant and lessor details",
  })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    description: "Contract generation data with optional file upload",
    schema: {
      type: "object",
      properties: {
        tenantUid: {
          type: "number",
          example: 5,
          description: "Tenant user id when the tenant is a registered user",
        },
        tenantName: {
          type: "string",
          example: "John Doe",
          description: "Tenant full name",
        },
        tenantEmail: {
          type: "string",
          format: "email",
          example: "tenant@example.com",
          description: "Tenant email address",
        },
        tenantPhone: {
          type: "string",
          example: "+1234567890",
          description: "Tenant phone number",
        },
        tenantLastname: {
          type: "string",
          example: "Doe",
          description: "Tenant last name",
        },
        tenantDocumentType: {
          type: "string",
          example: "CC",
          description: "Tenant document type",
        },
        tenantDocument: {
          type: "string",
          example: "123456789",
          description: "Tenant document number",
        },
        tenantAddress: {
          type: "string",
          example: "Street 123",
          description: "Tenant address",
        },
        tenantLegalRepresentative: {
          type: "string",
          example: "Representative Name",
          description: "Tenant legal representative",
        },
        lessorName: {
          type: "string",
          example: "Jane Smith",
          description: "Lessor (owner) full name",
        },
        lessorEmail: {
          type: "string",
          format: "email",
          example: "lessor@example.com",
          description: "Lessor email address",
        },
        lessorPhone: {
          type: "string",
          example: "+0987654321",
          description: "Lessor phone number",
        },
        lessorLastname: {
          type: "string",
          example: "Smith",
          description: "Lessor last name",
        },
        lessorDocument: {
          type: "string",
          example: "987654321",
          description: "Lessor document number",
        },
        lessorDocumentType: {
          type: "string",
          example: "NIT",
          description: "Lessor document type",
        },
        lessorAddress: {
          type: "string",
          example: "Main avenue 45",
          description: "Lessor address",
        },
        lessorLegalRepresentative: {
          type: "string",
          example: "Representative Name",
          description: "Lessor legal representative",
        },
        cosignerName: {
          type: "string",
          example: "Cosigner Name",
          description: "Cosigner full name",
        },
        cosignerDocument: {
          type: "string",
          example: "1122334455",
          description: "Cosigner document number",
        },
        cosignerAddress: {
          type: "string",
          example: "Cosigner street 10",
          description: "Cosigner address",
        },
        cosignerEmail: {
          type: "string",
          format: "email",
          example: "cosigner@example.com",
          description: "Cosigner email address",
        },
        cosignerPhone: {
          type: "string",
          example: "+123498765",
          description: "Cosigner phone number",
        },
        duration: {
          type: "string",
          example: "12 months",
          description: "Contract duration",
        },
        canon: {
          type: "string",
          example: "1500000",
          description: "Contract canon value",
        },
        startDate: {
          type: "string",
          format: "date",
          example: "2026-06-01",
          description: "Contract start date",
        },
        endDate: {
          type: "string",
          format: "date",
          example: "2027-06-01",
          description: "Contract end date",
        },
        placeAddress: {
          type: "string",
          example: "Property street 99",
          description: "Property address",
        },
        placeMunicipio: {
          type: "string",
          example: "Bogota",
          description: "Property municipality",
        },
        registrationNumber: {
          type: "string",
          example: "REG-001",
          description: "Property registration number",
        },
        hasSignature: {
          type: "boolean",
          example: false,
          description: "Whether the contract has been signed",
        },
        templateId: {
          type: "number",
          example: 1,
          description: "ID of the contract template to use",
        },
        file: {
          type: "string",
          format: "binary",
          description: "Contract PDF file (optional)",
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: "Contract generated and saved successfully",
    schema: {
      example: {
        message: "Contrato generado exitosamente",
        data: {
          cid: 1,
          tenant_uid: 5,
          lessor_uid: 2,
          tenant_name: "John Doe",
          tenant_email: "tenant@example.com",
          tenant_phone: "+1234567890",
          tenant_lastname: "Doe",
          tenant_document_type: "CC",
          tenant_document: "123456789",
          tenant_address: "Street 123",
          tenant_legal_representative: "Representative Name",
          lessor_name: "Jane Smith",
          lessor_email: "lessor@example.com",
          lessor_phone: "+0987654321",
          lessor_lastname: "Smith",
          lessor_document: "987654321",
          lessor_document_type: "NIT",
          lessor_address: "Main avenue 45",
          lessor_legal_representative: "Representative Name",
          cosigner_name: "Cosigner Name",
          cosigner_document: "1122334455",
          cosigner_address: "Cosigner street 10",
          cosigner_email: "cosigner@example.com",
          cosigner_phone: "+123498765",
          duration: "12 months",
          canon: "1500000",
          start_date: "2026-06-01",
          end_date: "2027-06-01",
          place_address: "Property street 99",
          place_municipio: "Bogota",
          registration_number: "REG-001",
          hasSignature: false,
          ct_id: 1,
          url: "https://cdn.example.com/contracts/contract_1.pdf",
          created_at: "2025-12-09T10:00:00.000Z",
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "Bad request - Invalid data or file",
  })
  async generateContract(
    @Body() generateContractDto: GenerateContractDto,
    @UploadedFile() file: Express.Multer.File | undefined,
    @UserId() uid: number,
  ) {
    let url: string | null = null;
    if (file) {
      url = (await this.filesService.uploadFile(file, uid)).url;
    }
    return await this.contractService.generateOne(
      generateContractDto,
      url,
      uid,
    );
  }

  @Get("templates/:id")
  @ResponseMessage("El template del contrato se ha recuperado con éxito")
  @ApiOperation({
    summary: "Get contract template by ID",
    description:
      "Retrieves a specific contract template with all its fields ordered by field order",
  })
  @ApiParam({
    name: "id",
    type: Number,
    description: "Contract template ID",
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: "Contract template retrieved successfully",
    schema: {
      example: {
        message: "El template del contrato se ha recuperado con éxito",
        data: {
          ct_id: 1,
          name: "Residential Lease Agreement",
          description: "Standard residential lease contract",
          category: "rental",
          type: "lease",
          url: "https://cdn.example.com/templates/lease.pdf",
          created_at: "2025-12-09T10:00:00.000Z",
          fields: [
            {
              ctf_id: 1,
              ct_id: 1,
              order: 1,
              name: "tenant_name",
              label: "Tenant Name",
              placeholder: "Enter tenant name",
              type: "text",
              x: 100,
              y: 200,
              page: 1,
            },
          ],
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: "Contract template not found",
  })
  getContractsTemplate(@Param("id", ParseIntPipe) id: number) {
    return this.contractService.getOneTemplate(id);
  }

  @Get("templates")
  @ResponseMessage("Los templates de contratos se han recuperado con éxito")
  @ApiOperation({
    summary: "Get all contract templates",
    description:
      "Retrieves all available contract templates with their fields ordered by field order",
  })
  @ApiResponse({
    status: 200,
    description: "Contract templates retrieved successfully",
    schema: {
      example: {
        message: "Los templates de contratos se han recuperado con éxito",
        data: [
          {
            ct_id: 1,
            name: "Residential Lease Agreement",
            description: "Standard residential lease contract",
            category: "rental",
            type: "lease",
            url: "https://cdn.example.com/templates/lease.pdf",
            created_at: "2025-12-09T10:00:00.000Z",
            fields: [
              {
                ctf_id: 1,
                ct_id: 1,
                order: 1,
                name: "tenant_name",
                label: "Tenant Name",
                placeholder: "Enter tenant name",
                type: "text",
                x: 100,
                y: 200,
                page: 1,
              },
            ],
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: "No contract templates found",
  })
  getContractsTemplates() {
    return this.contractService.getAllTemplates();
  }
}
