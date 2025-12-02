import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ContractTemplateEntity } from "./contract_templates.entity";

@Entity({ name: "contracts" })
export class ContractEntity {
  @PrimaryGeneratedColumn()
  cid: number;

  @Column({ nullable: false, type: "varchar", length: 30 })
  tenant_name: string;

  @Column({ nullable: false, type: "varchar", length: 100 })
  tenant_email: string;

  @Column({ nullable: false, type: "varchar", length: 15 })
  tennat_phone: string;

  @Column({ nullable: false, type: "varchar", length: 30 })
  lessor_name: string;

  @Column({ nullable: false, type: "varchar", length: 100 })
  lessor_email: string;

  @Column({ nullable: false, type: "varchar", length: 15 })
  lessor_phone: string;

  @Column({ default: false, type: "boolean" })
  hasSignature: boolean;

  @Column({ nullable: false, type: "text" })
  url: string;

  @OneToOne(() => ContractTemplateEntity, (template) => template.cid)
  @JoinColumn({ name: "ct_id" })
  template: ContractTemplateEntity;

  @CreateDateColumn()
  created_at: string;
}
