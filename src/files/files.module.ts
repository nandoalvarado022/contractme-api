import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { TypeOrmModule } from "@nestjs/typeorm"
import { UserEntity } from "src/user/user.entity"
import { AuditLogService } from "src/audit_logs/audit.service"
import { AuditLogsEntity } from "src/audit_logs/audit.entity"
import { FilesController } from "./files.controller"
import { FilesService } from "./files.service"

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([UserEntity]),
  ],
  exports: [FilesService],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
