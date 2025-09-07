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

  @Column({ nullable: false, type: "datetime" })
  start_date: Date

  @Column({ nullable: true, type: "datetime" })
  end_date: Date

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @DeleteDateColumn()
  deleted_at: Date

  @ManyToOne(() => UserEntity, (user) => user.education, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "uid" })
  user: UserEntity
}
