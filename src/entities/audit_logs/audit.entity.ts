import { Role } from 'src/common/enums/rol.enum';
import { UserEntity } from 'src/entities/user/user.entity';
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

  @Column()
  data: string;

  @Column({ nullable: true })
  created_at: string;

  @ManyToOne(() => UserEntity, user => user.logs, { nullable: true })
  @JoinColumn({ name: 'uid' }) 
  user: UserEntity;

  @ManyToOne(() => UserEntity, user => user.logs, { nullable: true })
  @JoinColumn({ name: 'uid_compromised' }) 
  user_compromised: UserEntity;
}
