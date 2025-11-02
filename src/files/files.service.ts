import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
  InternalServerErrorException,
} from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import {
  PutObjectCommand,
  S3Client,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3"
import { ConfigService } from "@nestjs/config"
import { UserEntity } from "src/entities/user/user.entity"

var StatsD = require('hot-shots');
var dogstatsd = new StatsD();

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name)
  private s3: S3Client
  private bucket: string

  constructor(
    private configService: ConfigService,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {
    const region = this.configService.get<string>("AWS_REGION")
    const accessKeyId = this.configService.get<string>("AWS_ACCESS_KEY_ID")
    const secretAccessKey = this.configService.get<string>(
      "AWS_SECRET_ACCESS_KEY"
    )
    const bucketName = this.configService.get<string>("AWS_BUCKET_NAME")

    if (!region || !accessKeyId || !secretAccessKey || !bucketName) {
      this.logger.error("Missing required AWS configuration")
      throw new Error("Missing required AWS configuration")
    }

    this.s3 = new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    })

    this.bucket = bucketName
    this.logger.log("AWS S3 client initialized successfully")
  }

  private async validateUser(uid: number): Promise<UserEntity> {
    this.logger.log(`Validating user with uid: ${uid}`)

    const user = await this.userRepository.findOne({ where: { uid } })

    if (!user) {
      this.logger.warn(`User not found with uid: ${uid}`)
      throw new NotFoundException(`User with uid ${uid} not found`)
    }

    this.logger.log(`User validation successful for uid: ${uid}`)
    return user
  }

  private validateFile(file: Express.Multer.File): void {
    if (!file) {
      this.logger.warn("No file provided in upload request")
      throw new BadRequestException("File is required")
    }

    if (!file.buffer || file.buffer.length === 0) {
      this.logger.warn("Empty file provided in upload request")
      throw new BadRequestException("File cannot be empty")
    }

    this.logger.log(
      `File validation successful: ${file.originalname}, size: ${file.size}, type: ${file.mimetype}`
    )
  }

  async uploadFile(file: Express.Multer.File, uid: number) {
    this.logger.log(`Starting file upload for user uid: ${uid}`)
    const start = Date.now();
    dogstatsd.increment('services.files.uploadFile');

    try {
      const user = await this.validateUser(uid)

      this.validateFile(file)

      const fileName = `${file.originalname.replace(
        /[^a-zA-Z0-9.-]/g,
        "_"
      )}`
      const path = `files/saved/${uid}/${fileName}`

      const params = {
        Bucket: this.bucket,
        Key: path,
        Body: file.buffer,
        ContentType: file.mimetype,
        Metadata: {
          "uploaded-by": uid.toString(),
          "original-name": file.originalname,
          "upload-date": new Date().toISOString(),
        },
      }

      this.logger.log(`Uploading file to S3: ${path}`)
      await this.s3.send(new PutObjectCommand(params))

      const result = {
        path,
        url: `${this.configService.get<string>("CLOUDFRONT_URL")}/${path}`,
        originalName: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
        uploadedAt: new Date(),
      }

      dogstatsd.increment('services.files.uploadFile.success');
      const durationMs = Date.now() - start;
      dogstatsd.histogram('services.files.uploadFile.duration', durationMs, [
        'repository:files',
        'operation:upload',
        'status:success',
      ]);

      this.logger.log(`File uploaded successfully for user ${uid}: ${path}`)
      return result
    } catch (error) {
      this.logger.error(`Error uploading file for user ${uid}:`, error.stack)
      dogstatsd.increment('services.files.uploadFile.error');
      const durationMs = Date.now() - start;
      dogstatsd.histogram('services.files.uploadFile.duration', durationMs, [
        'repository:files',
        'operation:upload',
        'status:error',
      ]);

      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error
      }

      throw new InternalServerErrorException("Failed to upload file to storage")
    }
  }

  async deleteFile(filePath: string, uid: number) {
    this.logger.log(`Starting file deletion: ${filePath} for user ${uid}`)

    try {
      await this.validateUser(uid)
      const checkParams = {
        Bucket: this.bucket,
        Key: filePath,
      }

      try {
        await this.s3.send(new GetObjectCommand(checkParams))
      } catch (error) {
        if (error.name === "NoSuchKey") {
          this.logger.warn(`File not found: ${filePath}`)
          throw new NotFoundException(`File not found: ${filePath}`)
        }
        throw error
      }

      const deleteParams = {
        Bucket: this.bucket,
        Key: filePath,
      }

      await this.s3.send(new DeleteObjectCommand(deleteParams))

      this.logger.log(`File deleted successfully: ${filePath}`)
      return { message: "File deleted successfully", filePath }
    } catch (error) {
      this.logger.error(`Error deleting file ${filePath}:`, error.stack)

      if (error instanceof NotFoundException) {
        throw error
      }

      throw new InternalServerErrorException(
        "Failed to delete file from storage"
      )
    }
  }

  async getFileInfo(filePath: string, uid: number) {
    this.logger.log(`Getting file info: ${filePath} for user ${uid}`)

    try {
      await this.validateUser(uid)

      const params = {
        Bucket: this.bucket,
        Key: filePath,
      }

      const result = await this.s3.send(new GetObjectCommand(params))

      const fileInfo = {
        path: filePath,
        url: `${this.configService.get<string>("CLOUDFRONT_URL")}/${filePath}`,
        size: result.ContentLength,
        lastModified: result.LastModified,
        contentType: result.ContentType,
        metadata: result.Metadata,
      }

      this.logger.log(`File info retrieved successfully: ${filePath}`)
      return fileInfo
    } catch (error) {
      this.logger.error(`Error getting file info ${filePath}:`, error.stack)

      if (error.name === "NoSuchKey") {
        throw new NotFoundException(`File not found: ${filePath}`)
      }

      throw new InternalServerErrorException(
        "Failed to retrieve file information"
      )
    }
  }
}
