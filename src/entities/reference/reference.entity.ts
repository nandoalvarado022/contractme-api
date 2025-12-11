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

@Entity({ name: "reference" })
export class ReferenceEntity {
  @ApiProperty({ description: "Unique identifier", example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: "Reference person's full name",
    example: "María García",
    maxLength: 100,
  })
  @Column({ nullable: false, type: "varchar", length: 100 })
  name: string;

  @ApiProperty({
    description: "Reference person's phone number",
    example: "+1234567890",
    maxLength: 15,
    nullable: true,
  })
  @Column({ nullable: true, type: "varchar", length: 15 })
  phone: string;

  @ApiProperty({
    description: "Relationship with the reference person",
    example: "Former supervisor",
    maxLength: 100,
  })
  @Column({ nullable: false, type: "varchar", length: 100 })
  relationship: string;

  @ApiProperty({ description: "Creation timestamp" })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({ description: "Last update timestamp" })
  @UpdateDateColumn()
  updated_at: Date;

  @ApiProperty({ description: "Soft delete timestamp" })
  @DeleteDateColumn()
  deleted_at: Date;

  @ApiProperty({ description: "User associated with this reference" })
  @ManyToOne(() => UserEntity, (user) => user.reference, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "uid" })
  user: UserEntity;
}
