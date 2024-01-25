import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Result } from '../../result/entities/result-upload.entity';
import { Team } from '../../team/entities';
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  state: string;

  @Column()
  stateId: string;

  @Column()
  LGA: string;

  @Column()
  LGAId: string;

  @Column()
  ward: string;

  @Column()
  wardId: string;

  @Column()
  pollingUnit: string;

  @Column()
  pollingUnitId: string;

  @Column({ nullable: true })
  secretToken: string;

  @OneToMany(() => Result, (result) => result.partyResultsId, {
    eager: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'resultId' })
  resultsId: Result[];

  @Column('text', { array: true, default: [] })
  teams: string[];

  @Column({ type: 'boolean', default: false })
  isVerified: boolean;
}
