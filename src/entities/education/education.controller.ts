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
import { EducationService } from "./education.service";
import { CreateEducationDto, UpdateEducationDto } from "./dto";
import { ResponseMessage } from "src/common/decorators";

@ApiTags("Education")
@Controller("education")
export class EducationController {
  constructor(private readonly educationService: EducationService) {}

  @Get("user/:uid")
  @ApiOperation({ summary: "Get all education records by user ID" })
  @ApiParam({ name: "uid", description: "User ID", type: Number })
  @ApiResponse({
    status: 200,
    description: "Education records retrieved successfully",
    schema: {
      example: [
        {
          id: 1,
          place: "Universidad de Miami",
          title: "Bachelor of Computer Science",
          start_date: "2018-09-01T00:00:00.000Z",
          end_date: "2022-06-15T00:00:00.000Z",
          created_at: "2025-12-09T10:00:00.000Z",
          updated_at: "2025-12-09T10:00:00.000Z",
        },
      ],
    },
  })
  @ApiResponse({ status: 404, description: "User not found" })
  @ResponseMessage("Education records retrieved successfully")
  getEducationByUser(@Param("uid", ParseIntPipe) uid: number) {
    return this.educationService.getEducationByUid(uid);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get education record by ID" })
  @ApiParam({ name: "id", description: "Education record ID", type: Number })
  @ApiResponse({
    status: 200,
    description: "Education record retrieved successfully",
    schema: {
      example: {
        id: 1,
        place: "Universidad de Miami",
        title: "Bachelor of Computer Science",
        start_date: "2018-09-01T00:00:00.000Z",
        end_date: "2022-06-15T00:00:00.000Z",
        created_at: "2025-12-09T10:00:00.000Z",
        updated_at: "2025-12-09T10:00:00.000Z",
      },
    },
  })
  @ApiResponse({ status: 404, description: "Education record not found" })
  @ResponseMessage("Education record retrieved successfully")
  getEducationById(@Param("id", ParseIntPipe) id: number) {
    return this.educationService.getEducationById(id);
  }

  @Post()
  @ApiOperation({ summary: "Create a new education record" })
  @ApiBody({ type: CreateEducationDto })
  @ApiResponse({
    status: 201,
    description: "Education record created successfully",
    schema: {
      example: {
        id: 1,
        place: "Universidad de Miami",
        title: "Bachelor of Computer Science",
        start_date: "2018-09-01T00:00:00.000Z",
        end_date: "2022-06-15T00:00:00.000Z",
        created_at: "2025-12-09T10:00:00.000Z",
        updated_at: "2025-12-09T10:00:00.000Z",
      },
    },
  })
  @ApiResponse({ status: 400, description: "Invalid input data" })
  @ResponseMessage("Education record created successfully")
  createEducation(@Body() createEducationDto: CreateEducationDto) {
    return this.educationService.createEducation(createEducationDto);
  }

  @Put(":id")
  @ApiOperation({ summary: "Update an education record" })
  @ApiParam({ name: "id", description: "Education record ID", type: Number })
  @ApiBody({ type: UpdateEducationDto })
  @ApiResponse({
    status: 200,
    description: "Education record updated successfully",
    schema: {
      example: {
        id: 1,
        place: "Universidad de Miami",
        title: "Master of Computer Science",
        start_date: "2018-09-01T00:00:00.000Z",
        end_date: "2022-06-15T00:00:00.000Z",
        created_at: "2025-12-09T10:00:00.000Z",
        updated_at: "2025-12-10T10:00:00.000Z",
      },
    },
  })
  @ApiResponse({ status: 404, description: "Education record not found" })
  @ApiResponse({ status: 400, description: "Invalid input data" })
  @ResponseMessage("Education record updated successfully")
  updateEducation(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateEducationDto: UpdateEducationDto,
  ) {
    return this.educationService.updateEducation(id, updateEducationDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete an education record" })
  @ApiParam({ name: "id", description: "Education record ID", type: Number })
  @ApiResponse({
    status: 200,
    description: "Education record deleted successfully",
    schema: {
      example: {
        deleted: true,
        id: 1,
      },
    },
  })
  @ApiResponse({ status: 404, description: "Education record not found" })
  @ResponseMessage("Education record deleted successfully")
  deleteEducation(@Param("id", ParseIntPipe) id: number) {
    return this.educationService.deleteEducation(id);
  }
}
