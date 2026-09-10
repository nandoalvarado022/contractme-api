import { ApiProperty } from "@nestjs/swagger";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ContractTemplateEntity } from "./contract_templates.entity";

@Entity({ name: "contracts" })
export class ContractEntity {
  @ApiProperty({
    description: "Unique contract identifier",
    example: 1,
  })
  @PrimaryGeneratedColumn()
  cid: number;

  @ApiProperty({
    description: "Tenant user id (FK to users)",
    required: false,
  })
  @Column({ nullable: true, type: "int" })
  tenant_uid?: number;

  @ApiProperty({
    description: "Lessor user id (FK to users)",
    required: false,
  })
  @Column({ nullable: true, type: "int" })
  lessor_uid?: number;

  @ApiProperty({
    description: "Tenant full name",
    example: "John Doe",
    maxLength: 150,
  })
  @Column({ nullable: true, type: "varchar", length: 150 })
  tenant_name: string;

  @ApiProperty({
    description: "Tenant email address",
    example: "tenant@example.com",
    maxLength: 100,
  })
  @Column({ nullable: true, type: "varchar", length: 100 })
  tenant_email: string;

  @ApiProperty({
    description: "Tenant phone number",
    example: "+1234567890",
    maxLength: 30,
  })
  @Column({ nullable: true, type: "varchar", length: 30 })
  tenant_phone: string;

  @ApiProperty({
    description: "Tenant last name",
    required: false,
  })
  @Column({ nullable: true, type: "varchar", length: 100 })
  tenant_lastname?: string;

  @ApiProperty({
    description: "Tenant document type",
    required: false,
  })
  @Column({ nullable: true, type: "varchar", length: 20 })
  tenant_document_type?: string;

  @ApiProperty({
    description: "Tenant document number",
    required: false,
  })
  @Column({ nullable: true, type: "varchar", length: 50 })
  tenant_document?: string;

  @ApiProperty({
    description: "Tenant address",
    required: false,
  })
  @Column({ nullable: true, type: "varchar", length: 255 })
  tenant_address?: string;

  @ApiProperty({
    description: "Tenant legal representative",
    required: false,
  })
  @Column({ nullable: true, type: "varchar", length: 150 })
  tenant_legal_representative?: string;

  @ApiProperty({
    description: "Lessor (owner) full name",
    example: "Jane Smith",
    maxLength: 150,
  })
  @Column({ nullable: true, type: "varchar", length: 150 })
  lessor_name: string;

  @ApiProperty({
    description: "Lessor email address",
    example: "lessor@example.com",
    maxLength: 100,
  })
  @Column({ nullable: true, type: "varchar", length: 100 })
  lessor_email: string;

  @ApiProperty({
    description: "Lessor phone number",
    example: "+0987654321",
    maxLength: 30,
  })
  @Column({ nullable: true, type: "varchar", length: 30 })
  lessor_phone: string;

  @ApiProperty({
    description: "Lessor last name",
    required: false,
  })
  @Column({ nullable: true, type: "varchar", length: 100 })
  lessor_lastname?: string;

  @ApiProperty({
    description: "Lessor document number",
    required: false,
  })
  @Column({ nullable: true, type: "varchar", length: 50 })
  lessor_document?: string;

  @ApiProperty({
    description: "Lessor document type",
    required: false,
  })
  @Column({ nullable: true, type: "varchar", length: 20 })
  lessor_document_type?: string;

  @ApiProperty({
    description: "Lessor address",
    required: false,
  })
  @Column({ nullable: true, type: "varchar", length: 255 })
  lessor_address?: string;

  @ApiProperty({
    description: "Lessor legal representative",
    required: false,
  })
  @Column({ nullable: true, type: "varchar", length: 150 })
  lessor_legal_representative?: string;

  @ApiProperty({
    description: "Cosigner full name",
    required: false,
  })
  @Column({ nullable: true, type: "varchar", length: 150 })
  cosigner_name?: string;

  @ApiProperty({
    description: "Cosigner document number",
    required: false,
  })
  @Column({ nullable: true, type: "varchar", length: 50 })
  cosigner_document?: string;

  @ApiProperty({
    description: "Cosigner address",
    required: false,
  })
  @Column({ nullable: true, type: "varchar", length: 255 })
  cosigner_address?: string;

  @ApiProperty({
    description: "Cosigner email address",
    required: false,
  })
  @Column({ nullable: true, type: "varchar", length: 100 })
  cosigner_email?: string;

  @ApiProperty({
    description: "Cosigner phone number",
    required: false,
  })
  @Column({ nullable: true, type: "varchar", length: 30 })
  cosigner_phone?: string;

  @ApiProperty({
    description: "Contract duration",
    required: false,
  })
  @Column({ nullable: true, type: "varchar", length: 50 })
  duration?: string;

  @ApiProperty({
    description: "Contract canon value",
    required: false,
  })
  @Column({ nullable: true, type: "varchar", length: 50 })
  canon?: string;

  @ApiProperty({
    description: "Contract start date",
    required: false,
  })
  @Column({ nullable: true, type: "date" })
  start_date?: string;

  @ApiProperty({
    description: "Contract end date",
    required: false,
  })
  @Column({ nullable: true, type: "date" })
  end_date?: string;

  @ApiProperty({
    description: "Property address",
    required: false,
  })
  @Column({ nullable: true, type: "varchar", length: 255 })
  place_address?: string;

  @ApiProperty({
    description: "Property municipality",
    required: false,
  })
  @Column({ nullable: true, type: "varchar", length: 100 })
  place_municipio?: string;

  @ApiProperty({
    description: "Property registration number",
    required: false,
  })
  @Column({ nullable: true, type: "varchar", length: 100 })
  registration_number?: string;

  @ApiProperty({
    description: "Whether the contract has been signed",
    example: false,
    default: false,
  })
  @Column({ default: false, type: "boolean", nullable: true })
  hasSignature: boolean;

  @ApiProperty({
    description: "URL to the contract PDF file (optional)",
    example: "https://cdn.example.com/contracts/contract_1.pdf",
    required: false,
  })
  @Column({ nullable: true, type: "text" })
  url: string;

  @ApiProperty({
    description: "Contract template id (FK to contracts_templates)",
    required: false,
  })
  @Column({ nullable: true, type: "int" })
  ct_id?: number;

  @ApiProperty({
    description: "Associated contract template",
    type: () => ContractTemplateEntity,
  })
  @ManyToOne(() => ContractTemplateEntity, { nullable: true })
  @JoinColumn({ name: "ct_id" })
  template: ContractTemplateEntity;

  @ApiProperty({
    description: "Contract creation timestamp",
    example: "2025-12-09T10:00:00.000Z",
  })
  @CreateDateColumn()
  created_at: string;
}
