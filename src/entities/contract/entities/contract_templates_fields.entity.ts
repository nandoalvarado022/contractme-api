import { ApiProperty } from "@nestjs/swagger";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ContractTemplateEntity } from "./contract_templates.entity";

@Entity({ name: "contracts_templates_fields" })
export class ContractTemplateFieldsEntity {
  @ApiProperty({
    description: "Unique field identifier",
    example: 1,
  })
  @PrimaryGeneratedColumn()
  ctf_id: number;

  @ApiProperty({
    description: "Contract template ID this field belongs to",
    example: 1,
  })
  @Column()
  ct_id: number;

  @ApiProperty({
    description: "Display order of the field",
    example: 1,
  })
  @Column()
  order: number;

  @ApiProperty({
    description: "Field name/identifier",
    example: "tenant_name",
  })
  @Column()
  name: string;

  @ApiProperty({
    description: "Field display label",
    example: "Tenant Name",
  })
  @Column()
  label: string;

  @ApiProperty({
    description: "Field placeholder text",
    example: "Enter tenant full name",
  })
  @Column()
  placeholder: string;

  @ApiProperty({
    description: "Field input type",
    example: "text",
  })
  @Column()
  type: string;

  @ApiProperty({
    description: "X coordinate position in PDF (optional)",
    example: 100,
    required: false,
  })
  @Column({ nullable: true })
  x: number;

  @ApiProperty({
    description: "Y coordinate position in PDF (optional)",
    example: 200,
    required: false,
  })
  @Column({ nullable: true })
  y: number;

  @ApiProperty({
    description: "PDF page number where field appears (optional)",
    example: 1,
    required: false,
  })
  @Column({ nullable: true })
  page: number;

  @ApiProperty({
    description: "Associated contract template",
    type: () => ContractTemplateEntity,
  })
  @ManyToOne(() => ContractTemplateEntity, (entity) => entity.fields)
  @JoinColumn({ name: "ct_id", referencedColumnName: "ct_id" })
  contractTemplate: ContractTemplateEntity;
}
