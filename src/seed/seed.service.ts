import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData, SeedProduct } from './data/seed-data';

@Injectable()
export class SeedService {
  constructor(private readonly productService: ProductsService) {}

  async runSeed() {

    await this.insertNewProducts();
  
    return `Seed executed`;
  }

  private async insertNewProducts() {
    this.productService.deleteAllProducts();

    const products: SeedProduct[] = initialData.products;

    const inserPromises = [];

    products.forEach(product => {
      inserPromises.push(this.productService.create(product));
    });

    const results = await Promise.all(inserPromises);

    return true;
  }
}
