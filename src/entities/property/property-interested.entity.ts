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
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @ManyToOne(() => PropertyEntity, (property) => property.interested, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "property_id" })
  property: PropertyEntity;

  @Column()
  property_id: number;

  @ManyToOne(() => UserEntity, { nullable: true })
  @JoinColumn({ name: "user_id" })
  user: UserEntity;

  @Column({ nullable: true })
  user_id: number;

  @Column({
    type: "datetime",
    default: () => "CURRENT_TIMESTAMP",
    nullable: false,
  })
  created_at: Date;

  @Column({
    type: "datetime",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
    nullable: false,
  })
  updated_at: Date;
}
