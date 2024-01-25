import { User } from 'src/user/entities';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Team {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  teamName: string;

  @Column()
  description: string;

  @Column()
  code: string;

  @Column()
  ownerEmail: string;

  @Column()
  ownerPhone: string;

  @Column()
  successMessage: string;

  @CreateDateColumn()
  createdAt: Date;
}
