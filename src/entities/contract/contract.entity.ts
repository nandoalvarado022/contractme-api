import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";

@Entity({ name: "contracts" })
export class ContractEntity {
  @PrimaryGeneratedColumn()
  cid: number;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column()
  url: string;

  @Column({ nullable: false })
  created_at: string;

  // @OneToMany('ContractFieldsEntity', 'contract')
  // fields: any[];
}
