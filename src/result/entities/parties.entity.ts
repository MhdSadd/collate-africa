import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Parties {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  partyId: string;

  @Column()
  partyName: string;

  @Column()
  partyAcronym: string;

  @Column()
  partyLogo: string;
}
