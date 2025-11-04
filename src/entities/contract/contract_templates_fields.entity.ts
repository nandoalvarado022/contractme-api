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
  @PrimaryGeneratedColumn()
  ctf_id: number;

  @Column()
  ct_id: number;

  @Column()
  order: number;

  @Column()
  name: string;

  @Column()
  label: string;

  @Column()
  placeholder: string;

  @Column()
  type: string;

  @Column({ nullable: true })
  x: number;

  @Column({ nullable: true })
  y: number;

  @Column({ nullable: true })
  page: number;

  @ManyToOne(() => ContractTemplateEntity, (entity) => entity.fields)
  @JoinColumn({ name: "ct_id", referencedColumnName: "ct_id" })
  contractTemplate: ContractTemplateEntity;
}
