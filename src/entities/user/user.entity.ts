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
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity({ name: "users" })
export class UserEntity {
  @PrimaryGeneratedColumn()
  uid: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column()
  phone: string;

  @Column({ type: "enum", enum: DocumentType })
  document_type: DocumentType;

  @Column({ type: "int" })
  document_number: number;

  @Column()
  picture: string;

  @Column()
  birth_date: string;

  @Column({ type: "enum", default: Role.USER, enum: Role })
  role: Role;

  @CreateDateColumn()
  created_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @OneToMany(() => EducationEntity, (education) => education.user, {
    nullable: true,
  })
  education: EducationEntity[];

  @OneToMany(() => ExperienceEntity, (experience) => experience.user, {
    nullable: true,
  })
  experience: ExperienceEntity[];

  @OneToMany(() => ReferenceEntity, (reference) => reference.user, {
    nullable: true,
  })
  reference: ReferenceEntity[];

  @OneToMany(() => AuditLogsEntity, (log) => log.user)
  logs: AuditLogsEntity[];
}
