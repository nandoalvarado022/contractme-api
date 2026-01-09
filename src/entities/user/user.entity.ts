import { ApiProperty } from "@nestjs/swagger";
import { AuditLogsEntity } from "src/entities/audit_logs/audit.entity";
import { DocumentType } from "src/common/enums/document-type";
import { Role } from "src/common/enums/rol.enum";
import { EducationEntity } from "src/entities/education/education.entity";
import { ExperienceEntity } from "src/entities/experience/experience.entity";
import { ReferenceEntity } from "src/entities/reference/reference.entity";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Transaction,
} from "typeorm";
import { BalanceEntity } from "../balance/entities/balance.entity";
import { TransactionsEntity } from "../transactions/entities/transactions.entity";

@Entity({ name: "users" })
export class UserEntity {
  @ApiProperty({
    description: "Unique user identifier",
    example: 1,
  })
  @PrimaryGeneratedColumn()
  uid: number;

  @ApiProperty({
    description: "User name",
    example: "John",
  })
  @Column()
  name: string;
  
  @ApiProperty({
    description: "User last name",
    example: "Doe",
  })
  @Column({ type: "varchar", length: 50, nullable: true })
  last_name: string;

  @ApiProperty({
    description: "User email address",
    example: "john@example.com",
  })
  @Column()
  email: string;

  @ApiProperty({
    description: "User hashed password",
    example: "$2b$10$...",
    writeOnly: true,
  })
  @Column({ nullable: false })
  password: string;

  @ApiProperty({
    description: "User phone number",
    example: "+1234567890",
  })
  @Column()
  phone: string;

  @ApiProperty({
    description: "Document type",
    enum: DocumentType,
    example: DocumentType.CC,
  })
  @Column({ type: "enum", enum: DocumentType })
  document_type: DocumentType;

  @ApiProperty({
    description: "Document number",
    example: 123456789,
  })
  @Column({ type: "int" })
  document_number: number;

  @ApiProperty({
    description: "User profile picture URL",
    example: "https://example.com/pictures/user.jpg",
  })
  @Column()
  picture: string;

  @ApiProperty({
    description: "User birth date",
    example: "1990-01-01",
  })
  @Column()
  birth_date: string;

  @ApiProperty({
    description: "User role",
    enum: Role,
    default: Role.USER,
    example: Role.USER,
  })
  @Column({ type: "enum", default: Role.USER, enum: Role })
  role: Role;

  @ApiProperty({
    description: "Account creation timestamp",
    example: "2025-12-09T10:00:00.000Z",
  })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({
    description: "Soft deletion timestamp",
    example: null,
    required: false,
  })
  @DeleteDateColumn()
  deleted_at: Date;

  @ApiProperty({
    description: "User education records",
    type: () => [EducationEntity],
    required: false,
  })
  @OneToMany(() => EducationEntity, (education) => education.user, {
    nullable: true,
  })
  education: EducationEntity[];

  @ApiProperty({
    description: "User work experience records",
    type: () => [ExperienceEntity],
    required: false,
  })
  @OneToMany(() => ExperienceEntity, (experience) => experience.user, {
    nullable: true,
  })
  experience: ExperienceEntity[];

  @ApiProperty({
    description: "User references",
    type: () => [ReferenceEntity],
    required: false,
  })
  @OneToMany(() => ReferenceEntity, (reference) => reference.user, {
    nullable: true,
  })
  reference: ReferenceEntity[];

  @ApiProperty({
    description: "Audit logs for this user",
    type: () => [AuditLogsEntity],
  })
  @OneToMany(() => AuditLogsEntity, (log) => log.user)
  logs: AuditLogsEntity[];

  @ApiProperty({
    description: "User balance information",
    type: () => BalanceEntity,
    required: false,
  })
  @OneToOne(() => BalanceEntity, (balance) => balance.user)
  balance: BalanceEntity;

  @OneToMany(() => TransactionsEntity, (transaction) => transaction.userId)
  uidTransactions: TransactionsEntity[];
}
