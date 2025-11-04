import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AuditLogsEntity } from "./audit.entity";
import { Repository } from "typeorm";
import { spanishMessages } from "src/common/constants/messages";

@Injectable()
export class AuditLogService {
  constructor(
    @InjectRepository(AuditLogsEntity)
    private auditLogsRepository: Repository<AuditLogsEntity>,
  ) {}

  async createAuditLog(auditLog: AuditLogsEntity) {
    try {
      return this.auditLogsRepository.save(auditLog);
    } catch (error) {
      console.error("Error creating audit log:", error);
      throw new Error(spanishMessages.audit.ERROR_CREATING_LOG);
    }
  }
}
