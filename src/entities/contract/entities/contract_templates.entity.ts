import { ApiProperty } from "@nestjs/swagger";
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ContractTemplateFieldsEntity } from "./contract_templates_fields.entity";
import { ContractEntity } from "./contract.entity";
import { STATUS_CONTRACT, type StatusContract } from "../consts/contract.consts";

@Entity({ name: "contracts_templates" })
export class ContractTemplateEntity {
  @ApiProperty({
    description: "Unique contract template identifier",
    example: 1,
  })
  @PrimaryGeneratedColumn()
  ct_id: number;

  @ApiProperty({
    description: "Template name",
    example: "Residential Lease Agreement",
  })
  @Column()
  name: string;

  @ApiProperty({
    description: "Template description",
    example: "Standard residential lease contract for rental properties",
  })
  @Column()
  description: string;

  @ApiProperty({
    description: "Template category",
    example: "rental",
  })
  @Column()
  category: string;

  @ApiProperty({
    description: "Contract type",
    example: "lease",
  })
  @Column()
  type: string;

  @ApiProperty({
    description: "URL to the template PDF file",
    example: "https://cdn.example.com/templates/lease_template.pdf",
  })
  @Column()
  url: string;

  @ApiProperty({
    description: "Template creation timestamp",
    example: "2025-12-09T10:00:00.000Z",
  })
  @Column({ nullable: false })
  created_at: string;

  @Column({ nullable: false, type: "enum", enum: STATUS_CONTRACT, default: STATUS_CONTRACT.ACTIVE })
  status: StatusContract;

  @ApiProperty({
    description: "Contract using this template",
    type: () => ContractEntity,
    required: false,
  })
  @OneToOne(() => ContractEntity, (contract) => contract.template)
  cid: ContractEntity;

  @ApiProperty({
    description: "Template fields for data entry",
    type: () => [ContractTemplateFieldsEntity],
  })
  @OneToMany(
    () => ContractTemplateFieldsEntity,
    (entity) => entity.contractTemplate,
  )
  fields: ContractTemplateFieldsEntity[];
}
