import { Injectable, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { ConfigService } from "@nestjs/config";
import {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { exec } from "child_process";
import { promisify } from "util";
import * as fs from "fs";
import * as path from "path";
import { format } from "date-fns";

const execAsync = promisify(exec);

@Injectable()
export class DatabaseBackupService {
  private readonly logger = new Logger(DatabaseBackupService.name);
  private s3: S3Client;
  private bucket: string;
  private readonly BACKUP_FOLDER = "database-backups";
  private readonly MAX_BACKUPS = 7;

  constructor(private configService: ConfigService) {
    const region = this.configService.get<string>("AWS_REGION");
    const accessKeyId = this.configService.get<string>("AWS_ACCESS_KEY_ID");
    const secretAccessKey = this.configService.get<string>(
      "AWS_SECRET_ACCESS_KEY",
    );
    const bucketName = this.configService.get<string>("AWS_BUCKET_NAME");

    if (!region || !accessKeyId || !secretAccessKey || !bucketName) {
      this.logger.error("Missing required AWS configuration for backups");
      throw new Error("Missing required AWS configuration for backups");
    }

    this.s3 = new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    this.bucket = bucketName;
    this.logger.log("AWS S3 client initialized for database backups");
  }

  /**
   * Cron job que se ejecuta todos los días a las 3:00 AM
   * Realiza un backup de la base de datos y lo sube a S3
   */
  @Cron("0 3 * * *", {
    name: "database-backup",
    timeZone: "America/Bogota",
  })
  async handleDatabaseBackup(): Promise<void> {
    this.logger.log("Starting database backup cron job...");

    const startTime = Date.now();
    let backupFilePath: string | null = null;

    try {
      backupFilePath = await this.createDatabaseBackup();
      await this.uploadBackupToS3(backupFilePath);
      await this.rotateOldBackups();
      await this.cleanupLocalFile(backupFilePath);

      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      this.logger.log(
        `Database backup completed successfully in ${duration}s`,
      );
    } catch (error) {
      this.logger.error("Error during database backup:", error.stack);

      if (backupFilePath) {
        await this.cleanupLocalFile(backupFilePath);
      }

      throw error;
    }
  }

  private async createDatabaseBackup(): Promise<string> {
    this.logger.log("Creating database backup...");

    const nodeEnv = this.configService.get<string>("NODE_ENV");
    const env = nodeEnv === "production" ? "REMOTE" : "LOCAL";
    const prefix = `DB_${env}`;

    const dbHost = this.configService.get<string>(`${prefix}_HOST`);
    const dbPort = this.configService.get<number>(`${prefix}_PORT`);
    const dbUser = this.configService.get<string>(`${prefix}_USERNAME`);
    const dbPassword = this.configService.get<string>(`${prefix}_PASSWORD`);
    const dbName = this.configService.get<string>(`${prefix}_DATABASE`);

    if (!dbHost || !dbPort || !dbUser || !dbPassword || !dbName) {
      throw new Error("Missing database configuration for backup");
    }

    const timestamp = format(new Date(), "yyyy-MM-dd_HH-mm-ss");
    const fileName = `backup_${dbName}_${timestamp}.sql`;
    const backupDir = path.join(process.cwd(), "temp-backups");
    const backupFilePath = path.join(backupDir, fileName);

    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const dumpCommand = `mysqldump -h ${dbHost} -P ${dbPort} -u ${dbUser} -p${dbPassword} ${dbName} > "${backupFilePath}"`;

    try {
      await execAsync(dumpCommand);
      this.logger.log(`Database backup created: ${fileName}`);

      const stats = fs.statSync(backupFilePath);
      if (stats.size === 0) {
        throw new Error("Backup file is empty");
      }

      this.logger.log(
        `Backup file size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`,
      );

      return backupFilePath;
    } catch (error) {
      this.logger.error("Error creating database backup:", error.message);
      throw new Error(`Failed to create database backup: ${error.message}`);
    }
  }

  private async uploadBackupToS3(filePath: string): Promise<void> {
    this.logger.log(`Uploading backup to S3: ${filePath}`);

    try {
      const fileContent = fs.readFileSync(filePath);
      const fileName = path.basename(filePath);
      const s3Key = `${this.BACKUP_FOLDER}/${fileName}`;

      const params = {
        Bucket: this.bucket,
        Key: s3Key,
        Body: fileContent,
        ContentType: "application/sql",
        Metadata: {
          "backup-date": new Date().toISOString(),
          "backup-type": "daily",
          "database-name": this.configService.get<string>(
            `DB_${this.configService.get<string>("NODE_ENV") === "production" ? "REMOTE" : "LOCAL"}_DATABASE`,
          ) || "unknown",
        },
      };

      await this.s3.send(new PutObjectCommand(params));
      this.logger.log(`Backup uploaded successfully to S3: ${s3Key}`);
    } catch (error) {
      this.logger.error("Error uploading backup to S3:", error.stack);
      throw new Error(`Failed to upload backup to S3: ${error.message}`);
    }
  }

  private async rotateOldBackups(): Promise<void> {
    this.logger.log(
      `Rotating old backups (keeping last ${this.MAX_BACKUPS})...`,
    );

    try {
      const listParams = {
        Bucket: this.bucket,
        Prefix: `${this.BACKUP_FOLDER}/`,
      };

      const listResponse = await this.s3.send(
        new ListObjectsV2Command(listParams),
      );

      if (!listResponse.Contents || listResponse.Contents.length === 0) {
        this.logger.log("No backups found in S3");
        return;
      }

      const sortedBackups = listResponse.Contents.sort((a, b) => {
        const dateA = a.LastModified ? a.LastModified.getTime() : 0;
        const dateB = b.LastModified ? b.LastModified.getTime() : 0;
        return dateB - dateA;
      });

      this.logger.log(`Found ${sortedBackups.length} backups in S3`);

      if (sortedBackups.length > this.MAX_BACKUPS) {
        const backupsToDelete = sortedBackups.slice(this.MAX_BACKUPS);

        this.logger.log(
          `Deleting ${backupsToDelete.length} old backup(s)...`,
        );

        for (const backup of backupsToDelete) {
          if (backup.Key) {
            try {
              await this.s3.send(
                new DeleteObjectCommand({
                  Bucket: this.bucket,
                  Key: backup.Key,
                }),
              );
              this.logger.log(`Deleted old backup: ${backup.Key}`);
            } catch (error) {
              this.logger.error(
                `Error deleting backup ${backup.Key}:`,
                error.message,
              );
            }
          }
        }
      } else {
        this.logger.log(
          `No rotation needed. Current backups: ${sortedBackups.length}/${this.MAX_BACKUPS}`,
        );
      }
    } catch (error) {
      this.logger.error("Error rotating old backups:", error.stack);
    }
  }

  private async cleanupLocalFile(filePath: string): Promise<void> {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        this.logger.log(`Local backup file deleted: ${filePath}`);
      }
    } catch (error) {
      this.logger.warn(`Failed to delete local file ${filePath}:`, error.message);
    }
  }

  async executeManualBackup(): Promise<{ message: string; backupKey: string }> {
    this.logger.log("Manual backup triggered");

    let backupFilePath: string | null = null;

    try {
      backupFilePath = await this.createDatabaseBackup();
      await this.uploadBackupToS3(backupFilePath);
      await this.rotateOldBackups();
      await this.cleanupLocalFile(backupFilePath);

      const fileName = path.basename(backupFilePath);
      return {
        message: "Backup completed successfully",
        backupKey: `${this.BACKUP_FOLDER}/${fileName}`,
      };
    } catch (error) {
      if (backupFilePath) {
        await this.cleanupLocalFile(backupFilePath);
      }
      throw error;
    }
  }
}
