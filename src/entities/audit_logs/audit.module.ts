import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuditLogsEntity } from "./audit.entity";
import { AuditLogService } from "./audit.service";

@Module({
  imports: [TypeOrmModule.forFeature([AuditLogsEntity])],
  controllers: [],
  providers: [AuditLogService],
  exports: [AuditLogService],
})
export class AuditModule {}
