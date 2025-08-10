import { UserEntity } from "src/user/user.entity"
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"

@Entity({ name: "education" })
export class EducationEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: false, type: "varchar", length: 100 })
  place: string

  @Column({ nullable: false, type: "varchar", length: 100 })
  title: string

  @Column({ nullable: false, type: "date" })
  start_date: Date

  @Column({ nullable: true, type: "date" })
  end_date: Date

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @DeleteDateColumn()
  deleted_at: Date

  @Column()
  user_id: number

  @ManyToOne(() => UserEntity, (user) => user.education, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id", referencedColumnName: "uid" })
  user: UserEntity
}
