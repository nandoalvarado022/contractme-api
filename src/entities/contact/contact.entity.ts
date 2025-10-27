import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { TYPE_CONTACT, TypeContact } from "./contact.model";

@Entity('leads')
export class ContactEntity {
  @PrimaryGeneratedColumn()
  lid: number

  @Column({
    type: "varchar",
    length: 100,
    name: "full_name",
    nullable: false,
  })
  fullName: string

  @Column({
    type: "varchar",
    length: 100,
    name: "email",
    nullable: false,
  })
  email: string

  @Column({
    type: "varchar",
    length: 20,
    name: "phone",
    nullable: true,
  })
  phone: string

  @Column({
    type: "enum",
    enum: TYPE_CONTACT,
    name: "type_contact",
    nullable: false,
  })
  reason: TypeContact

  @Column({
    type: "text",
    name: "message",
    nullable: false,
  })
  message: string
}