import { ApiProperty } from "@nestjs/swagger";
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "global_variables" })
@Index("key", ["key"], { unique: true })
export class GlobalVariablesEntity {
  @ApiProperty({
    description: "Unique identifier",
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: "Variable key/name",
    example: "MAINTENANCE_MODE",
    maxLength: 100,
  })
  @Column({
    type: "varchar",
    length: 100,
    nullable: false,
  })
  key: string;

  @ApiProperty({
    description: "Variable value",
    example: "false",
  })
  @Column({
    type: "text",
    nullable: false,
  })
  value: string;

  @ApiProperty({
    description: "Creation timestamp",
    example: "2025-12-16T10:00:00.000Z",
  })
  @CreateDateColumn({ type: "timestamp", precision: 6 })
  created_at: Date;

  @ApiProperty({
    description: "Last update timestamp",
    example: "2025-12-16T10:00:00.000Z",
  })
  @UpdateDateColumn({ type: "timestamp", precision: 6 })
  updated_at: Date;
}
