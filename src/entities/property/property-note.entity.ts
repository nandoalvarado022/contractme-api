import { ApiProperty } from "@nestjs/swagger";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { PropertyEntity } from "./property.entity";

@Entity({ name: "property_notes" })
export class PropertyNote {
  @ApiProperty({ description: "Unique identifier", example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: "Note text",
    example: "Property needs minor repairs",
  })
  @Column("text")
  text: string;

  @ApiProperty({ description: "Associated property" })
  @ManyToOne(() => PropertyEntity, (property) => property.notes, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "property_id" })
  property: PropertyEntity;

  @ApiProperty({ description: "Property ID", example: 1 })
  @Column()
  property_id: number;

  @ApiProperty({ description: "Creation timestamp" })
  @Column({
    type: "datetime",
    default: () => "CURRENT_TIMESTAMP",
    nullable: false,
  })
  created_at: Date;

  @ApiProperty({ description: "Last update timestamp" })
  @Column({
    type: "datetime",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
    nullable: false,
  })
  updated_at: Date;
}
