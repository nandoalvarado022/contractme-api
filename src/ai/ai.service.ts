import { Injectable } from "@nestjs/common"

@Injectable()
export class AIService {
  constructor() {}

  getAIResponse() {
    return "AI response"
  }
}
