import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Seeder } from 'nestjs-seeder';
import { Repository } from 'typeorm';
import { Parties } from '../result/entities';
import { getParties } from './seedData/parties';

@Injectable()
export class PartiesSeeder implements Seeder {
  constructor(
    @InjectRepository(Parties)
    private readonly partyRepo: Repository<Parties>,
  ) {}

  async seed(): Promise<any> {
    await this.partyRepo
      .createQueryBuilder('party')
      .delete()
      .from(Parties)
      .execute();

    // Insert into the database.;
    const partiesData = await getParties();

    await this.partyRepo
      .createQueryBuilder()
      .insert()
      .into(Parties)
      .values(partiesData)
      .execute();
    return { msg: 'Parties seeded successfully' };
  }

  async drop(): Promise<any> {
    await this.partyRepo
      .createQueryBuilder('party')
      .delete()
      .from(Parties)
      .execute();
    return { msg: 'Parties data dropped successfully' };
  }
}
