import { Injectable } from '@nestjs/common';
import { ProductsService } from './../products/products.service';

@Injectable()
export class SeedService {
  
  constructor( private productService: ProductsService) {}

  async runSeed() {
    await this.insertNewProducts();
    return `SEED EXECUTED`;
  }

  private async insertNewProducts() {
    this.productService.deleteAllProducts();
    return true;
  }

}
