import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseIntPipe,
  UseInterceptors,
  Req,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiHeader,
} from "@nestjs/swagger";
import { TransformResponseInterceptor } from "../../common/interceptors";
import { ResponseMessage } from "../../common/decorators";
import { PropertyService } from "./property.service";
import { CreatePropertyDto } from "./dto/create-property.dto";
import { UpdatePropertyDto } from "./dto/update-property.dto";
import { CreatePropertyNoteDto } from "./dto/create-property-note.dto";
import { CreatePropertyInterestedDto } from "./dto/create-property-interested.dto";
import { Request } from "express";

@ApiTags("Properties")
@Controller("properties")
@UseInterceptors(TransformResponseInterceptor)
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Get("owner")
  @ApiOperation({
    summary: "Get properties by owner",
    description: "Retrieves all properties owned by the authenticated user",
  })
  @ApiHeader({
    name: "uid",
    description: "User ID from authentication",
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: "Properties retrieved successfully",
  })
  findByOwner(@Req() req: Request) {
    const uid = Number(req.headers["uid"]);
    return this.propertyService.findByOwner(uid);
  }

  @Post()
  @ApiOperation({
    summary: "Create new property",
    description: "Creates a new property listing",
  })
  @ApiBody({ type: CreatePropertyDto })
  @ApiResponse({
    status: 201,
    description: "Property created successfully",
    schema: {
      example: {
        id: 1,
        city: "Miami",
        address: "123 Main Street",
        image: "https://example.com/property.jpg",
        price: 250000,
        type: "apartment",
        bedrooms: 3,
        bathrooms: 2,
        area: 120.5,
        description: "Beautiful apartment with ocean view",
        owner_uid: 1,
        created_at: "2025-12-09T10:00:00.000Z",
        updated_at: "2025-12-09T10:00:00.000Z",
      },
    },
  })
  @ApiResponse({ status: 400, description: "Invalid input data" })
  @ResponseMessage("Propiedad creada exitosamente")
  create(@Body() createPropertyDto: CreatePropertyDto) {
    return this.propertyService.create(createPropertyDto);
  }

  @Get()
  @ApiOperation({
    summary: "Get all properties",
    description: "Retrieves all property listings",
  })
  @ApiResponse({
    status: 200,
    description: "Properties retrieved successfully",
  })
  findAll() {
    return this.propertyService.findAll();
  }

  @Get(":id")
  @ApiOperation({
    summary: "Get property by ID",
    description: "Retrieves a specific property by its ID",
  })
  @ApiParam({ name: "id", description: "Property ID", type: Number })
  @ApiResponse({
    status: 200,
    description: "Property retrieved successfully",
  })
  @ApiResponse({ status: 404, description: "Property not found" })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.propertyService.findOne(id);
  }

  @Put(":id")
  @ApiOperation({
    summary: "Update property",
    description: "Updates an existing property",
  })
  @ApiParam({ name: "id", description: "Property ID", type: Number })
  @ApiBody({ type: UpdatePropertyDto })
  @ApiResponse({
    status: 200,
    description: "Property updated successfully",
  })
  @ApiResponse({ status: 404, description: "Property not found" })
  @ApiResponse({ status: 400, description: "Invalid input data" })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updatePropertyDto: UpdatePropertyDto,
  ) {
    return this.propertyService.update(id, updatePropertyDto);
  }

  @Delete(":id")
  @ApiOperation({
    summary: "Delete property",
    description: "Deletes a property listing",
  })
  @ApiParam({ name: "id", description: "Property ID", type: Number })
  @ApiResponse({
    status: 200,
    description: "Property deleted successfully",
  })
  @ApiResponse({ status: 404, description: "Property not found" })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.propertyService.remove(id);
  }

  @Get("tenant/:tenantId")
  @ApiOperation({
    summary: "Get properties by tenant",
    description: "Retrieves all properties rented by a specific tenant",
  })
  @ApiParam({ name: "tenantId", description: "Tenant user ID", type: Number })
  @ApiResponse({
    status: 200,
    description: "Properties retrieved successfully",
  })
  @ApiResponse({ status: 404, description: "Tenant not found" })
  findByTenant(@Param("tenantId", ParseIntPipe) tenantId: number) {
    return this.propertyService.findByTenant(tenantId);
  }

  @Post(":id/notes")
  @ApiOperation({
    summary: "Add note to property",
    description: "Adds a new note to a specific property",
  })
  @ApiParam({ name: "id", description: "Property ID", type: Number })
  @ApiBody({ type: CreatePropertyNoteDto })
  @ApiResponse({
    status: 201,
    description: "Note added successfully",
    schema: {
      example: {
        id: 1,
        text: "Property needs minor repairs",
        property_id: 1,
        created_at: "2025-12-09T10:00:00.000Z",
        updated_at: "2025-12-09T10:00:00.000Z",
      },
    },
  })
  @ApiResponse({ status: 404, description: "Property not found" })
  @ApiResponse({ status: 400, description: "Invalid input data" })
  addNote(
    @Param("id", ParseIntPipe) id: number,
    @Body() noteDto: CreatePropertyNoteDto,
  ) {
    return this.propertyService.addNote(id, noteDto);
  }

  @Post(":id/interested")
  @ApiOperation({
    summary: "Add interested party",
    description: "Registers a person interested in a property",
  })
  @ApiParam({ name: "id", description: "Property ID", type: Number })
  @ApiBody({ type: CreatePropertyInterestedDto })
  @ApiResponse({
    status: 201,
    description: "Interested party added successfully",
    schema: {
      example: {
        id: 1,
        name: "Carlos López",
        phone: "+1234567890",
        email: "carlos.lopez@example.com",
        property_id: 1,
        user_id: 5,
        created_at: "2025-12-09T10:00:00.000Z",
        updated_at: "2025-12-09T10:00:00.000Z",
      },
    },
  })
  @ApiResponse({ status: 404, description: "Property not found" })
  @ApiResponse({ status: 400, description: "Invalid input data" })
  addInterested(
    @Param("id", ParseIntPipe) id: number,
    @Body() interestedDto: CreatePropertyInterestedDto,
  ) {
    return this.propertyService.addInterested(id, interestedDto);
  }
}
