import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ContractTemplateFieldsEntity } from "./contract_templates_fields.entity";

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

  @OneToMany(
    () => ContractTemplateFieldsEntity,
    (entity) => entity.contractTemplate,
  )
  fields: ContractTemplateFieldsEntity[];
}
