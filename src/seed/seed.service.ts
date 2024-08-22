import { Inject, Injectable } from '@nestjs/common';
import { ProductsService } from './../products/products.service';
import { initialData } from './data/seed-data';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SeedService {
  
  constructor( 
    private productService: ProductsService,
    @InjectRepository(User) 
    private readonly usertRepository: Repository<User>
  ) {}

  async runSeed() {
    await this.deleteTables();
    const adminUser = await this.insertUsers();
    await this.insertNewProducts(adminUser);
    return `SEED EXECUTED`;
  }

  private async deleteTables() {

    await this.productService.deleteAllProducts();

    const queryBuilder = this.usertRepository.createQueryBuilder();
    await queryBuilder
      .delete()
      .where({})
      .execute();
  }

  private async insertUsers() {
    const seedUsers = initialData.users;
    const users: User[] = [];

    seedUsers.forEach( user => {
      users.push(this.usertRepository.create( user ))
    });

    const usersDB = await this.usertRepository.save(seedUsers);
    return usersDB[0];
  }

  private async insertNewProducts( user: User) {
    await this.productService.deleteAllProducts();

    const producs = initialData.products;

    const insertPromises = [];
    producs.forEach( product => {
      insertPromises.push(this.productService.create(product, user));
    });

    await Promise.all(insertPromises);

    return true;
  }

}
