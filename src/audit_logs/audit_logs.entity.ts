import { Role } from 'src/common/enums/rol.enum';
import { UserEntity } from 'src/user/user.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'audit_logs' })
export class AuditLogsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column()
  table: string;

  @Column({ nullable: false })
  created_at: string;

  @ManyToOne(() => UserEntity, user => user.logs)
  @JoinColumn({ name: 'uid' }) 
  user: UserEntity;
}
