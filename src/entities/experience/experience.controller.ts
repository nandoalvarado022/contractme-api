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
import { ExperienceService } from "./experience.service";
import { CreateExperienceDto, UpdateExperienceDto } from "./dto";
import { ResponseMessage } from "src/common/decorators";

@Controller("experience")
export class ExperienceController {
  constructor(private readonly experienceService: ExperienceService) {}

  @Get("user/:uid")
  @ResponseMessage("Experience records retrieved successfully")
  getExperienceByUser(@Param("uid", ParseIntPipe) uid: number) {
    return this.experienceService.getExperienceByUid(uid);
  }

  @Get(":id")
  @ResponseMessage("Experience record retrieved successfully")
  getExperienceById(@Param("id", ParseIntPipe) id: number) {
    return this.experienceService.getExperienceById(id);
  }

  @Post()
  @ResponseMessage("Experience record created successfully")
  createExperience(@Body() createExperienceDto: CreateExperienceDto) {
    return this.experienceService.createExperience(createExperienceDto);
  }

  @Put(":id")
  @ResponseMessage("Experience record updated successfully")
  updateExperience(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateExperienceDto: UpdateExperienceDto,
  ) {
    return this.experienceService.updateExperience(id, updateExperienceDto);
  }

  @Delete(":id")
  @ResponseMessage("Experience record deleted successfully")
  deleteExperience(@Param("id", ParseIntPipe) id: number) {
    return this.experienceService.deleteExperience(id);
  }
}
