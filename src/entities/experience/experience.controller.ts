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
import { ExperienceService } from "./experience.service";
import { CreateExperienceDto, UpdateExperienceDto } from "./dto";
import { ResponseMessage } from "src/common/decorators";

@ApiTags("Experience")
@Controller("experience")
export class ExperienceController {
  constructor(private readonly experienceService: ExperienceService) {}

  @Get("user/:uid")
  @ApiOperation({ summary: "Get all experience records by user ID" })
  @ApiParam({ name: "uid", description: "User ID", type: Number })
  @ApiResponse({
    status: 200,
    description: "Experience records retrieved successfully",
  })
  @ApiResponse({ status: 404, description: "User not found" })
  @ResponseMessage("Experience records retrieved successfully")
  getExperienceByUser(@Param("uid", ParseIntPipe) uid: number) {
    return this.experienceService.getExperienceByUid(uid);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get experience record by ID" })
  @ApiParam({ name: "id", description: "Experience record ID", type: Number })
  @ApiResponse({
    status: 200,
    description: "Experience record retrieved successfully",
  })
  @ApiResponse({ status: 404, description: "Experience record not found" })
  @ResponseMessage("Experience record retrieved successfully")
  getExperienceById(@Param("id", ParseIntPipe) id: number) {
    return this.experienceService.getExperienceById(id);
  }

  @Post()
  @ApiOperation({ summary: "Create a new experience record" })
  @ApiBody({ type: CreateExperienceDto })
  @ApiResponse({
    status: 201,
    description: "Experience record created successfully",
  })
  @ApiResponse({ status: 400, description: "Invalid input data" })
  @ResponseMessage("Experience record created successfully")
  createExperience(@Body() createExperienceDto: CreateExperienceDto) {
    return this.experienceService.createExperience(createExperienceDto);
  }

  @Put(":id")
  @ApiOperation({ summary: "Update an experience record" })
  @ApiParam({ name: "id", description: "Experience record ID", type: Number })
  @ApiBody({ type: UpdateExperienceDto })
  @ApiResponse({
    status: 200,
    description: "Experience record updated successfully",
  })
  @ApiResponse({ status: 404, description: "Experience record not found" })
  @ApiResponse({ status: 400, description: "Invalid input data" })
  @ResponseMessage("Experience record updated successfully")
  updateExperience(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateExperienceDto: UpdateExperienceDto,
  ) {
    return this.experienceService.updateExperience(id, updateExperienceDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete an experience record" })
  @ApiParam({ name: "id", description: "Experience record ID", type: Number })
  @ApiResponse({
    status: 200,
    description: "Experience record deleted successfully",
  })
  @ApiResponse({ status: 404, description: "Experience record not found" })
  @ResponseMessage("Experience record deleted successfully")
  deleteExperience(@Param("id", ParseIntPipe) id: number) {
    return this.experienceService.deleteExperience(id);
  }
}
