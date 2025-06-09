import { Injectable } from '@nestjs/common';
import { AuditLogsEntity } from './audit_logs/audit_logs.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(AuditLogsEntity)
    private logsRepository: Repository<AuditLogsEntity>
  ) { }

  getHello(): string {
    return 'Hello World!';
  }

  async getLogs() {
    const result = await this.logsRepository.find();
    return result.map(item => {
      return {
        ...item,
        created_at: formatDistanceToNow(new Date(item.created_at), {
          addSuffix: true,
          locale: es,
        }),
      }
    })
  }
}
