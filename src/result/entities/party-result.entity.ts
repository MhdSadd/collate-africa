import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Result } from './result-upload.entity';

@Entity()
export class PartyResult {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Result, (result) => result.partyResultsId, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  resultId: Result;

  @Column()
  partyAcronym: string;

  @Column()
  partyId: string;

  @Column()
  vote: string;

  @CreateDateColumn()
  createdAt: Date;
}
