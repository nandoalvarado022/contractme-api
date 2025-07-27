import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm"
import { PropertyEntity } from "./property.entity"

@Entity({ name: "property_notes" })
export class PropertyNote {
  @PrimaryGeneratedColumn()
  id: number

  @Column("text")
  text: string

  @Column("date")
  date: Date

  @ManyToOne(() => PropertyEntity, (property) => property.notes, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "property_id" })
  property: PropertyEntity

  @Column()
  property_id: number

  @Column({
    type: "datetime",
    default: () => "CURRENT_TIMESTAMP",
    nullable: false,
  })
  created_at: Date

  @Column({
    type: "datetime",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
    nullable: false,
  })
  updated_at: Date
}
