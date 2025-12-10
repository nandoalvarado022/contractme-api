import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ContractTemplateFieldsEntity } from "./contract_templates_fields.entity";
import { ContractEntity } from "./contract.entity";

@Entity({ name: "contracts_templates" })
export class ContractTemplateEntity {
  @PrimaryGeneratedColumn()
  ct_id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  category: string;

  @Column()
  type: string;

  @Column()
  url: string;

  @Column({ nullable: false })
  created_at: string;

  @OneToOne(() => ContractEntity, (contract) => contract.template)
  cid: ContractEntity;

  @OneToMany(
    () => ContractTemplateFieldsEntity,
    (entity) => entity.contractTemplate,
  )
  fields: ContractTemplateFieldsEntity[];
}
