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
import { EducationService } from "./education.service";
import { CreateEducationDto, UpdateEducationDto } from "./dto";
import { ResponseMessage } from "src/common/decorators";

@Controller("education")
export class EducationController {
  constructor(private readonly educationService: EducationService) {}

  @Get("user/:uid")
  @ResponseMessage("Education records retrieved successfully")
  getEducationByUser(@Param("uid", ParseIntPipe) uid: number) {
    return this.educationService.getEducationByUid(uid);
  }

  @Get(":id")
  @ResponseMessage("Education record retrieved successfully")
  getEducationById(@Param("id", ParseIntPipe) id: number) {
    return this.educationService.getEducationById(id);
  }

  @Post()
  @ResponseMessage("Education record created successfully")
  createEducation(@Body() createEducationDto: CreateEducationDto) {
    return this.educationService.createEducation(createEducationDto);
  }

  @Put(":id")
  @ResponseMessage("Education record updated successfully")
  updateEducation(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateEducationDto: UpdateEducationDto,
  ) {
    return this.educationService.updateEducation(id, updateEducationDto);
  }

  @Delete(":id")
  @ResponseMessage("Education record deleted successfully")
  deleteEducation(@Param("id", ParseIntPipe) id: number) {
    return this.educationService.deleteEducation(id);
  }
}
