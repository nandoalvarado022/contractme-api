import { UserEntity } from "src/entities/user/user.entity";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { PropertyNote } from "./property-note.entity";
import { PropertyInterested } from "./property-interested.entity";

@Entity({ name: "properties" })
export class PropertyEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  city: string;

  @Column()
  address: string;

  @Column()
  image: string;

  @Column("decimal", { precision: 10, scale: 2 })
  price: number;

  @Column()
  type: string;

  @Column()
  bedrooms: number;

  @Column()
  bathrooms: number;

  @Column("decimal", { precision: 10, scale: 2 })
  area: number;

  @Column("text")
  description: string;

  @ManyToOne(() => UserEntity, { eager: true })
  @JoinColumn({ name: "owner_uid" })
  owner: UserEntity;

  @Column()
  owner_uid: number;

  @ManyToOne(() => UserEntity, { nullable: true, eager: true })
  @JoinColumn({ name: "tenant_id" })
  tenant: UserEntity;

  @Column({ nullable: true })
  tenant_id: number;

  @OneToMany(() => PropertyNote, (note) => note.property, {
    cascade: true,
    eager: true,
  })
  notes: PropertyNote[];

  @OneToMany(() => PropertyInterested, (interested) => interested.property, {
    cascade: true,
    eager: true,
  })
  interested: PropertyInterested[];

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
