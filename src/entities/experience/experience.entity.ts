import { UserEntity } from "src/entities/user/user.entity";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "experience" })
export class ExperienceEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, type: "varchar", length: 100 })
  company: string;

  @Column({ nullable: false, type: "varchar", length: 100 })
  position: string;

  @Column({ nullable: false, type: "datetime" })
  start_date: Date;

  @Column({ nullable: false, type: "datetime" })
  end_date: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @ManyToOne(() => UserEntity, (user) => user.experience, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "uid" })
  user: UserEntity;
}
