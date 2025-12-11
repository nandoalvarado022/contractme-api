import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from 'src/entities/user/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'education' })
export class EducationEntity {
  @ApiProperty({ description: 'Unique identifier', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Educational institution name',
    example: 'Universidad de Miami',
    maxLength: 100,
  })
  @Column({ nullable: false, type: 'varchar', length: 100 })
  place: string;

  @ApiProperty({
    description: 'Degree or certification title',
    example: 'Bachelor of Computer Science',
    maxLength: 100,
  })
  @Column({ nullable: false, type: 'varchar', length: 100 })
  title: string;

  @ApiProperty({
    description: 'Start date of the education',
    example: '2018-09-01T00:00:00.000Z',
  })
  @Column({ nullable: false, type: 'datetime' })
  start_date: Date;

  @ApiProperty({
    description: 'End date of the education',
    example: '2022-06-15T00:00:00.000Z',
    nullable: true,
  })
  @Column({ nullable: true, type: 'datetime' })
  end_date: Date;

  @ApiProperty({ description: 'Creation timestamp' })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @UpdateDateColumn()
  updated_at: Date;

  @ApiProperty({ description: 'Soft delete timestamp' })
  @DeleteDateColumn()
  deleted_at: Date;

  @ApiProperty({ description: 'User associated with this education record' })
  @ManyToOne(() => UserEntity, (user) => user.education, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'uid' })
  user: UserEntity;
}
