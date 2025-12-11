import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { TYPE_CONTACT, TypeContact } from "./contact.model";

@Entity("leads")
export class ContactEntity {
  @ApiProperty({ description: "Lead unique identifier", example: 1 })
  @PrimaryGeneratedColumn()
  lid: number;

  @ApiProperty({
    description: "Contact person's full name",
    example: "María González",
    maxLength: 100,
  })
  @Column({
    type: "varchar",
    length: 100,
    name: "full_name",
    nullable: false,
  })
  fullName: string;

  @ApiProperty({
    description: "Contact person's email address",
    example: "maria.gonzalez@example.com",
    maxLength: 100,
  })
  @Column({
    type: "varchar",
    length: 100,
    name: "email",
    nullable: false,
  })
  email: string;

  @ApiPropertyOptional({
    description: "Contact person's phone number",
    example: "+1234567890",
    maxLength: 20,
    nullable: true,
  })
  @Column({
    type: "varchar",
    length: 20,
    name: "phone",
    nullable: true,
  })
  phone: string;

  @ApiProperty({
    description: "Reason for contact",
    enum: Object.values(TYPE_CONTACT),
    example: "information",
  })
  @Column({
    type: "enum",
    enum: TYPE_CONTACT,
    name: "type_contact",
    nullable: false,
  })
  reason: TypeContact;

  @ApiProperty({
    description: "Message or inquiry from the contact",
    example: "I would like to know more about your services",
  })
  @Column({
    type: "text",
    name: "message",
    nullable: false,
  })
  message: string;
}
