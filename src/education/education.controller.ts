import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common"
import { EducationService } from "./education.service"

@Controller("education")
export class EducationController {
  constructor(private readonly educationService: EducationService) {}

  @Get(":uid")
  getEducation(@Param("uid", ParseIntPipe) uid: number) {
    return this.educationService.getEducationByUid(uid)
  }
}
