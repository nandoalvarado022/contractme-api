import { Get, Controller, Post, Query } from "@nestjs/common"
import { AIService } from "./ai.service"

@Controller("ai")
export class AIController {
  constructor(private readonly aiService: AIService) {}

  @Get("query-file")
  getAIResponse(@Query("file") file: string, @Query("query") query: string) {
    return this.aiService.getAIResponse()
  }
}
