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

@Entity({ name: "reference" })
export class ReferenceEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: false, type: "varchar", length: 100 })
  name: string

  @Column({ nullable: true, type: "varchar", length: 15 })
  phone: string

  @Column({ nullable: false, type: "varchar", length: 100 })
  relationship: string

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @DeleteDateColumn()
  deleted_at: Date

  @ManyToOne(() => UserEntity, (user) => user.reference, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "uid" })
  user: UserEntity
}
