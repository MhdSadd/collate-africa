import { User } from '../../user/entities';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PartyResult } from './party-result.entity';

@Entity()
export class Result {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  total_valid_votes: string;

  @Column()
  total_rejected_votes: string;

  @Column()
  total_accredited_voters: string;

  @Column()
  resultURL: string;

  @Column()
  election: string;

  @Column()
  state: string;

  @Column()
  LGA: string;

  @Column()
  ward: string;

  @Column()
  pollingUnit: string;

  @Column({ nullable: true })
  ip: string;

  @Column({ name: 'userid' })
  userId: string;

  @OneToMany(() => PartyResult, (partyResult) => partyResult.resultId, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  partyResultsId: PartyResult[];

  @CreateDateColumn()
  createdAt: Date;
}
