import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";

@Entity({ name: "contracts_fields" })
export class ContractFieldsEntity {
  @PrimaryGeneratedColumn()
  cf_id: number;

  @Column()
  cid: number;

  @Column()
  name: string;

  @Column()
  value: string;

  // @ManyToOne('ContractEntity', 'fields')
  // @JoinColumn({ name: 'cid', referencedColumnName: 'cid' })
  // contract: any;
}
