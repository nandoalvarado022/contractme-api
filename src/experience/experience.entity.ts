import { Role } from 'src/common/enums/rol.enum';
import { UserEntity } from 'src/user/user.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'studies_and_experiences' })
export class StudiesAndExperiencesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ unique: true, nullable: false })
  entity: string;

  @Column({ nullable: false })
  start_date: string;

  @Column()
  end_date: string;

  @ManyToOne(() => UserEntity, user => user.experiences)
  @JoinColumn({ name: 'uid' }) 
  user: UserEntity;
}
