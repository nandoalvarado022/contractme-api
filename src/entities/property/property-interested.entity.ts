import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { UserEntity } from "src/entities/user/user.entity";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { PropertyEntity } from "./property.entity";

@Entity({ name: "property_interested" })
export class PropertyInterested {
  @ApiProperty({ description: "Unique identifier", example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: "Interested person's name",
    example: "Carlos López",
  })
  @Column()
  name: string;

  @ApiProperty({
    description: "Interested person's phone",
    example: "+1234567890",
  })
  @Column()
  phone: string;

  @ApiProperty({
    description: "Interested person's email",
    example: "carlos.lopez@example.com",
  })
  @Column()
  email: string;

  @ApiProperty({ description: "Associated property" })
  @ManyToOne(() => PropertyEntity, (property) => property.interested, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "property_id" })
  property: PropertyEntity;

  @ApiProperty({ description: "Property ID", example: 1 })
  @Column()
  property_id: number;

  @ApiPropertyOptional({ description: "Associated user if registered" })
  @ManyToOne(() => UserEntity, { nullable: true })
  @JoinColumn({ name: "user_id" })
  user: UserEntity;

  @ApiPropertyOptional({ description: "User ID", example: 5 })
  @Column({ nullable: true })
  user_id: number;

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
