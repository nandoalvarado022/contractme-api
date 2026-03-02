import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserEntity } from 'src/entities/user/user.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PropertyNote } from './property-note.entity';
import { PropertyInterested } from './property-interested.entity';

@Entity({ name: 'properties' })
export class PropertyEntity {
  @ApiProperty({ description: 'Unique identifier', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'City', example: 'Miami' })
  @Column()
  city: string;

  @ApiProperty({ description: 'Address', example: '123 Main Street' })
  @Column()
  address: string;

  @ApiProperty({
    description: 'Property image URL',
    example: 'https://example.com/property.jpg',
  })
  @Column()
  image: string;

  @ApiProperty({ description: 'Price', example: 250000, type: Number })
  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @ApiProperty({ description: 'Property type', example: 'apartment' })
  @Column()
  type: string;

  @ApiProperty({ description: 'Number of bedrooms', example: 3 })
  @Column()
  bedrooms: number;

  @ApiProperty({ description: 'Number of bathrooms', example: 2 })
  @Column()
  bathrooms: number;

  @ApiProperty({ description: 'Area in square meters', example: 120.5 })
  @Column('decimal', { precision: 10, scale: 2 })
  area: number;

  @ApiProperty({
    description: 'Property description',
    example: 'Beautiful apartment with ocean view',
  })
  @Column('text')
  description: string;

  @ApiProperty({ description: 'Owner user' })
  @ManyToOne(() => UserEntity, { eager: true })
  @JoinColumn({ name: 'owner_uid' })
  owner: UserEntity;

  @ApiProperty({ description: 'Owner user ID', example: 1 })
  @Column()
  owner_uid: number;

  @ApiPropertyOptional({ description: 'Tenant user' })
  @ManyToOne(() => UserEntity, { nullable: true, eager: true })
  @JoinColumn({ name: 'tenant_id' })
  tenant: UserEntity;

  @ApiPropertyOptional({ description: 'Tenant user ID', example: 2 })
  @Column({ nullable: true })
  tenant_id: number;

  @ApiProperty({ description: 'Property notes', type: [PropertyNote] })
  @OneToMany(() => PropertyNote, (note) => note.property, {
    cascade: true,
    eager: true,
  })
  notes: PropertyNote[];

  @ApiProperty({
    description: 'Interested parties',
    type: [PropertyInterested],
  })
  @OneToMany(() => PropertyInterested, (interested) => interested.property, {
    cascade: true,
    eager: true,
  })
  interested: PropertyInterested[];

  @ApiProperty({ description: 'Creation timestamp' })
  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  created_at: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  updated_at: Date;

  @ApiPropertyOptional({
    description: 'Soft deletion timestamp',
    example: null,
  })
  @DeleteDateColumn()
  deleted_at: Date;
}
