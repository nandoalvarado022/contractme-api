import { AuditLogsEntity } from 'src/audit_logs/audit.entity';
import { Role } from 'src/common/enums/rol.enum';
import { StudiesAndExperiencesEntity } from 'src/experience/experience.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  uid: number;

  @Column()
  name: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column()
  phone: string;

  @Column()
  picture: string;

  @Column({ type: 'enum', default: Role.USER, enum: Role })
  role: Role;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', nullable: false })
  created_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @OneToMany(() => StudiesAndExperiencesEntity, exp => exp.user)
  experiences: StudiesAndExperiencesEntity[];

  @OneToMany(() => StudiesAndExperiencesEntity, exp => exp.user)
  logs: AuditLogsEntity[];
}
