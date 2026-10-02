import { applyDecorators } from "@nestjs/common";
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from "@nestjs/swagger";

export function ApiGenerateContract() {
  return applyDecorators(
    ApiOperation({
      summary: "Generate new contract",
      description:
        "Generates a new contract from a template, uploads the contract file, and stores contract information with tenant and lessor details",
    }),
    ApiConsumes("multipart/form-data"),
    ApiBody({
      description: "Contract generation data with optional file upload",
      schema: {
        type: "object",
        required: ["templateId"],
        properties: {
          lessorName: {
            type: "string",
            example: "Jane Smith",
            description: "Lessor (owner) full name",
          },
          lessorLastname: {
            type: "string",
            example: "Smith",
            description: "Lessor last name",
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
          lessorDocumentType: {
            type: "string",
            example: "CC",
            description: "Lessor document type",
          },
          lessorDocument: {
            type: "string",
            example: "1234567890",
            description: "Lessor document number",
          },
          lessorAddress: {
            type: "string",
            example: "Calle 10 #20-30",
            description: "Lessor address",
          },
          lessorLegalRepresentative: {
            type: "string",
            example: "Carlos Perez",
            description: "Lessor legal representative",
          },
          tenantName: {
            type: "string",
            example: "John Doe",
            description: "Tenant full name",
          },
          tenantLastname: {
            type: "string",
            example: "Doe",
            description: "Tenant last name",
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
          tenantDocumentType: {
            type: "string",
            example: "CC",
            description: "Tenant document type",
          },
          tenantDocument: {
            type: "string",
            example: "9876543210",
            description: "Tenant document number",
          },
          tenantAddress: {
            type: "string",
            example: "Carrera 15 #8-40",
            description: "Tenant address",
          },
          tenantLegalRepresentative: {
            type: "string",
            example: "Ana Gomez",
            description: "Tenant legal representative",
          },
          cosignerName: {
            type: "string",
            example: "Pedro Ruiz",
            description: "Cosigner full name",
          },
          cosignerDocument: {
            type: "string",
            example: "1122334455",
            description: "Cosigner document number",
          },
          cosignerAddress: {
            type: "string",
            example: "Avenida 4 #12-05",
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
            example: "+573001112233",
            description: "Cosigner phone number",
          },
          duration: {
            type: "string",
            example: "12 meses",
            description: "Contract duration",
          },
          canon: {
            type: "number",
            example: 1500000,
            description: "Monthly rent (canon)",
          },
          startDate: {
            type: "string",
            example: "2026-01-01",
            description: "Contract start date",
          },
          endDate: {
            type: "string",
            example: "2026-12-31",
            description: "Contract end date",
          },
          placeAddress: {
            type: "string",
            example: "Calle 50 #10-20",
            description: "Property address",
          },
          placeMunicipio: {
            type: "string",
            example: "Barranquilla",
            description: "Property municipality",
          },
          registrationNumber: {
            type: "string",
            example: "080-123456",
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
    }),
    ApiResponse({
      status: 201,
      description: "Contract generated and saved successfully",
      schema: {
        example: {
          message: "Contrato generado exitosamente",
          data: {
            cid: 1,
            tenant_name: "John Doe",
            tenant_email: "tenant@example.com",
            tenantPhone: "+1234567890",
            lessor_name: "Jane Smith",
            lessor_email: "lessor@example.com",
            lessor_phone: "+0987654321",
            hasSignature: false,
            url: "https://cdn.example.com/contracts/contract_1.pdf",
            created_at: "2025-12-09T10:00:00.000Z",
          },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: "Bad request - Invalid data or file",
    }),
  );
}

export function ApiGetContractTemplate() {
  return applyDecorators(
    ApiOperation({
      summary: "Get contract template by ID",
      description:
        "Retrieves a specific contract template with all its fields ordered by field order",
    }),
    ApiParam({
      name: "id",
      type: Number,
      description: "Contract template ID",
      example: 1,
    }),
    ApiResponse({
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
    }),
    ApiResponse({
      status: 404,
      description: "Contract template not found",
    }),
  );
}

export function ApiGetContractTemplates() {
  return applyDecorators(
    ApiOperation({
      summary: "Get all contract templates",
      description:
        "Retrieves all available contract templates with their fields ordered by field order",
    }),
    ApiResponse({
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
    }),
    ApiResponse({
      status: 404,
      description: "No contract templates found",
    }),
  );
}
