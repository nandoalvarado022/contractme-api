import { ApiProperty } from "@nestjs/swagger";
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
  @ApiProperty({ description: "Unique identifier", example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: "Company name",
    example: "Tech Solutions Inc.",
    maxLength: 100,
  })
  @Column({ nullable: false, type: "varchar", length: 100 })
  company: string;

  @ApiProperty({
    description: "Position or job title",
    example: "Senior Software Developer",
    maxLength: 100,
  })
  @Column({ nullable: false, type: "varchar", length: 100 })
  position: string;

  @ApiProperty({
    description: "Start date of the experience",
    example: "2020-01-15T00:00:00.000Z",
  })
  @Column({ nullable: false, type: "datetime" })
  start_date: Date;

  @ApiProperty({
    description: "End date of the experience",
    example: "2023-06-30T00:00:00.000Z",
  })
  @Column({ nullable: false, type: "datetime" })
  end_date: Date;

  @ApiProperty({ description: "Creation timestamp" })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({ description: "Last update timestamp" })
  @UpdateDateColumn()
  updated_at: Date;

  @ApiProperty({ description: "Soft delete timestamp" })
  @DeleteDateColumn()
  deleted_at: Date;

  @ApiProperty({ description: "User associated with this experience" })
  @ManyToOne(() => UserEntity, (user) => user.experience, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "uid" })
  user: UserEntity;
}
