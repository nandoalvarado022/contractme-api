import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ContractTemplateEntity } from './contract_templates.entity';

@Entity({ name: 'contracts' })
export class ContractEntity {
  @ApiProperty({
    description: 'Unique contract identifier',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  cid: number;

  @ApiProperty({
    description: 'Tenant full name',
    example: 'John Doe',
    maxLength: 30,
  })
  @Column({ nullable: false, type: 'varchar', length: 30 })
  tenant_name: string;

  @ApiProperty({
    description: 'Tenant email address',
    example: 'tenant@example.com',
    maxLength: 100,
  })
  @Column({ nullable: false, type: 'varchar', length: 100 })
  tenant_email: string;

  @ApiProperty({
    description: 'Tenant phone number',
    example: '+1234567890',
    maxLength: 15,
  })
  @Column({ nullable: false, type: 'varchar', length: 15 })
  tennat_phone: string;

  @ApiProperty({
    description: 'Lessor (owner) full name',
    example: 'Jane Smith',
    maxLength: 30,
  })
  @Column({ nullable: false, type: 'varchar', length: 30 })
  lessor_name: string;

  @ApiProperty({
    description: 'Lessor email address',
    example: 'lessor@example.com',
    maxLength: 100,
  })
  @Column({ nullable: false, type: 'varchar', length: 100 })
  lessor_email: string;

  @ApiProperty({
    description: 'Lessor phone number',
    example: '+0987654321',
    maxLength: 15,
  })
  @Column({ nullable: false, type: 'varchar', length: 15 })
  lessor_phone: string;

  @ApiProperty({
    description: 'Whether the contract has been signed',
    example: false,
    default: false,
  })
  @Column({ default: false, type: 'boolean' })
  hasSignature: boolean;

  @ApiProperty({
    description: 'URL to the contract PDF file',
    example: 'https://cdn.example.com/contracts/contract_1.pdf',
  })
  @Column({ nullable: false, type: 'text' })
  url: string;

  @ApiProperty({
    description: 'Associated contract template',
    type: () => ContractTemplateEntity,
  })
  @OneToOne(() => ContractTemplateEntity, (template) => template.cid)
  @JoinColumn({ name: 'ct_id' })
  template: ContractTemplateEntity;

  @ApiProperty({
    description: 'Contract creation timestamp',
    example: '2025-12-09T10:00:00.000Z',
  })
  @CreateDateColumn()
  created_at: string;
}
