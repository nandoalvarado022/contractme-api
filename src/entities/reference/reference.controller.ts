import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from "@nestjs/swagger";
import { ResponseMessage } from "src/common/decorators";
import { ReferenceService } from "./reference.service";
import { CreateReferenceDto } from "./dto/create-reference.dto";
import { UpdateReferenceDto } from "./dto/update-reference.dto";

@ApiTags("References")
@Controller("reference")
export class ReferenceController {
  constructor(private readonly referenceService: ReferenceService) {}

  @Get("user/:uid")
  @ApiOperation({ summary: "Get all reference records by user ID" })
  @ApiParam({ name: "uid", description: "User ID", type: Number })
  @ApiResponse({
    status: 200,
    description: "Reference records retrieved successfully",
    schema: {
      example: [
        {
          id: 1,
          name: "María García",
          phone: "+1234567890",
          relationship: "Former supervisor",
          created_at: "2025-12-09T10:00:00.000Z",
          updated_at: "2025-12-09T10:00:00.000Z",
        },
      ],
    },
  })
  @ApiResponse({ status: 404, description: "User not found" })
  @ResponseMessage("Reference records retrieved successfully")
  getReferenceByUser(@Param("uid", ParseIntPipe) uid: number) {
    return this.referenceService.getReferenceByUid(uid);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get reference record by ID" })
  @ApiParam({ name: "id", description: "Reference record ID", type: Number })
  @ApiResponse({
    status: 200,
    description: "Reference record retrieved successfully",
    schema: {
      example: {
        id: 1,
        name: "María García",
        phone: "+1234567890",
        relationship: "Former supervisor",
        created_at: "2025-12-09T10:00:00.000Z",
        updated_at: "2025-12-09T10:00:00.000Z",
      },
    },
  })
  @ApiResponse({ status: 404, description: "Reference record not found" })
  @ResponseMessage("Reference record retrieved successfully")
  getReferenceById(@Param("id", ParseIntPipe) id: number) {
    return this.referenceService.getReferenceById(id);
  }

  @Post()
  @ApiOperation({ summary: "Create a new reference record" })
  @ApiBody({ type: CreateReferenceDto })
  @ApiResponse({
    status: 201,
    description: "Reference record created successfully",
    schema: {
      example: {
        id: 1,
        name: "María García",
        phone: "+1234567890",
        relationship: "Former supervisor",
        created_at: "2025-12-09T10:00:00.000Z",
        updated_at: "2025-12-09T10:00:00.000Z",
      },
    },
  })
  @ApiResponse({ status: 400, description: "Invalid input data" })
  @ResponseMessage("Reference record created successfully")
  createReference(@Body() createReferenceDto: CreateReferenceDto) {
    return this.referenceService.createReference(createReferenceDto);
  }

  @Put(":id")
  @ApiOperation({ summary: "Update a reference record" })
  @ApiParam({ name: "id", description: "Reference record ID", type: Number })
  @ApiBody({ type: UpdateReferenceDto })
  @ApiResponse({
    status: 200,
    description: "Reference record updated successfully",
    schema: {
      example: {
        id: 1,
        name: "María García Updated",
        phone: "+1234567890",
        relationship: "Current supervisor",
        created_at: "2025-12-09T10:00:00.000Z",
        updated_at: "2025-12-10T10:00:00.000Z",
      },
    },
  })
  @ApiResponse({ status: 404, description: "Reference record not found" })
  @ApiResponse({ status: 400, description: "Invalid input data" })
  @ResponseMessage("Reference record updated successfully")
  updateReference(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateReferenceDto: UpdateReferenceDto,
  ) {
    return this.referenceService.updateReference(id, updateReferenceDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a reference record" })
  @ApiParam({ name: "id", description: "Reference record ID", type: Number })
  @ApiResponse({
    status: 200,
    description: "Reference record deleted successfully",
    schema: {
      example: {
        deleted: true,
        id: 1,
      },
    },
  })
  @ApiResponse({ status: 404, description: "Reference record not found" })
  @ResponseMessage("Reference record deleted successfully")
  deleteReference(@Param("id", ParseIntPipe) id: number) {
    return this.referenceService.deleteReference(id);
  }
}
