import { Module } from "@nestjs/common"
import { AIService } from "./ai.service"
import { AIController } from "./ai.controller"

@Module({
  imports: [],
  exports: [],
  controllers: [AIController],
  providers: [AIService],
})
export class AIModule {}
