import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from "@nestjs/common"
import { ResponseMessage } from "src/common/decorators"
import { ReferenceService } from "./reference.service"
import { CreateReferenceDto } from "./dto/create-reference.dto"
import { UpdateReferenceDto } from "./dto/update-reference.dto"

@Controller("reference")
export class ReferenceController {
  constructor(private readonly referenceService: ReferenceService) {}

  @Get("user/:uid")
  @ResponseMessage("Reference records retrieved successfully")
  getReferenceByUser(@Param("uid", ParseIntPipe) uid: number) {
    return this.referenceService.getReferenceByUid(uid)
  }

  @Get(":id")
  @ResponseMessage("Reference record retrieved successfully")
  getReferenceById(@Param("id", ParseIntPipe) id: number) {
    return this.referenceService.getReferenceById(id)
  }

  @Post()
  @ResponseMessage("Reference record created successfully")
  createReference(@Body() createReferenceDto: CreateReferenceDto) {
    return this.referenceService.createReference(createReferenceDto)
  }

  @Put(":id")
  @ResponseMessage("Reference record updated successfully")
  updateReference(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateReferenceDto: UpdateReferenceDto
  ) {
    return this.referenceService.updateReference(id, updateReferenceDto)
  }

  @Delete(":id")
  @ResponseMessage("Reference record deleted successfully")
  deleteReference(@Param("id", ParseIntPipe) id: number) {
    return this.referenceService.deleteReference(id)
  }
}
