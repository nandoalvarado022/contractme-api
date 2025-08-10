import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common"
import { ExperienceService } from "./experience.service"

@Controller("experience")
export class ExperienceController {
  constructor(private readonly experienceService: ExperienceService) {}

  @Get(":id")
  getExperience(@Param("id", ParseIntPipe) id: number) {
    return this.experienceService.getExperienceByUid(id)
  }
}
