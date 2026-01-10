import { Controller, Post, Get } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { DatabaseBackupService } from "./database-backup.service";

@ApiTags("Database Backup")
@Controller("backup")
export class BackupController {
  constructor(private readonly backupService: DatabaseBackupService) {}

  @Post("manual")
  @ApiOperation({
    summary: "Execute manual database backup",
    description:
      "Triggers a manual database backup. Creates a MySQL dump and uploads it to S3. Automatically rotates old backups keeping only the last 7 days.",
  })
  @ApiResponse({
    status: 200,
    description: "Backup completed successfully",
    schema: {
      example: {
        message: "Backup completed successfully",
        backupKey: "database-backups/backup_contractme_2026-01-09_15-30-00.sql",
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: "Internal server error during backup",
  })
  async executeManualBackup() {
    return await this.backupService.executeManualBackup();
  }
}
