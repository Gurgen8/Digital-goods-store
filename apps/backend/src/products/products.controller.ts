import { Controller, Get } from '@nestjs/common';
import { ProductsService } from '@/products/products.service';

@Controller('api/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getProducts() {
    const products = await this.productsService.findAll();
    return products.map(p => ({
      id: p.id,
      title: p.name,
      subtitle: p.subtitle,
      priceRub: p.price,
      oldPriceRub: p.oldPrice,
      imageUrl: p.image,
    }));
  }
}
