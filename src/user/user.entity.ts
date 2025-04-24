import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  uid: number;

  @Column()
  id: number; // TODO: Remove this field
  
  @Column()
  name: string;

  @Column()
  document_number: number;

  @Column()
  league: string;

  @Column()
  is_certificated: boolean;

  @Column()
  login_code: number;

  @Column()
  email: string;

  @Column()
  rol: string;
  
  @Column()
  phone: string;

  @Column()
  token: string;

  @Column()
  is_admin: boolean;

  @Column()
  picture: string;

  @Column()
  city: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', nullable: false })
  created_at: Date;
}
