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
        required: [
          "tennatName",
          "tennatEmail",
          "tennatPhone",
          "lessorName",
          "lessorEmail",
          "lessorPhone",
          "hasSignature",
          "templateId",
        ],
        properties: {
          tennatName: {
            type: "string",
            example: "John Doe",
            description: "Tenant full name",
          },
          tennatEmail: {
            type: "string",
            format: "email",
            example: "tenant@example.com",
            description: "Tenant email address",
          },
          tennatPhone: {
            type: "string",
            example: "+1234567890",
            description: "Tenant phone number",
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
            tennat_phone: "+1234567890",
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
