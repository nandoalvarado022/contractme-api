import { AuditLogsEntity } from "src/audit_logs/audit.entity"
import { Role } from "src/common/enums/rol.enum"
import { EducationEntity } from "src/education/education.entity"
import { ExperienceEntity } from "src/experience/experience.entity"
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm"

@Entity({ name: "users" })
export class UserEntity {
  @PrimaryGeneratedColumn()
  uid: number

  @Column()
  name: string

  @Column({ nullable: true, type: "varchar", length: 100 })
  last_name: string

  @Column({ unique: true, nullable: false })
  email: string

  @Column({ nullable: false })
  password: string

  @Column()
  phone: string

  @Column()
  document_type: string

  @Column()
  document_number: number

  @Column()
  picture: string

  @Column()
  birth_date: string

  @Column({ type: "enum", default: Role.USER, enum: Role })
  role: Role

  @CreateDateColumn()
  created_at: Date

  @DeleteDateColumn()
  deleted_at: Date

  @OneToMany(() => EducationEntity, (education) => education.user)
  education: EducationEntity[]

  @OneToMany(() => ExperienceEntity, (experience) => experience.user)
  experience: ExperienceEntity[]

  @OneToMany(() => AuditLogsEntity, (log) => log.user)
  logs: AuditLogsEntity[]
}
