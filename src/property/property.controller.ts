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
} from "@nestjs/common"
import { TransformResponseInterceptor } from "../common/interceptors"
import { ResponseMessage } from "../common/decorators"
import { PropertyService } from "./property.service"
import { CreatePropertyDto } from "./dto/create-property.dto"
import { UpdatePropertyDto } from "./dto/update-property.dto"
import { CreatePropertyNoteDto } from "./dto/create-property-note.dto"
import { CreatePropertyInterestedDto } from "./dto/create-property-interested.dto"

@Controller("properties")
@UseInterceptors(TransformResponseInterceptor)
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Post()
  @ResponseMessage("Propiedad creada exitosamente")
  create(@Body() createPropertyDto: CreatePropertyDto) {
    return this.propertyService.create(createPropertyDto)
  }

  @Get()
  findAll() {
    return this.propertyService.findAll()
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.propertyService.findOne(id)
  }

  @Put(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updatePropertyDto: UpdatePropertyDto
  ) {
    return this.propertyService.update(id, updatePropertyDto)
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.propertyService.remove(id)
  }

  // Rutas adicionales
  @Get("owner/:ownerId")
  findByOwner(@Param("ownerId", ParseIntPipe) ownerId: number) {
    return this.propertyService.findByOwner(ownerId)
  }

  @Get("tenant/:tenantId")
  findByTenant(@Param("tenantId", ParseIntPipe) tenantId: number) {
    return this.propertyService.findByTenant(tenantId)
  }

  @Post(":id/notes")
  addNote(
    @Param("id", ParseIntPipe) id: number,
    @Body() noteDto: CreatePropertyNoteDto
  ) {
    return this.propertyService.addNote(id, noteDto)
  }

  @Post(":id/interested")
  addInterested(
    @Param("id", ParseIntPipe) id: number,
    @Body() interestedDto: CreatePropertyInterestedDto
  ) {
    return this.propertyService.addInterested(id, interestedDto)
  }
}
