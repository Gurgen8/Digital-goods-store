import { Controller, Get, Sse, Post, Body, Param, Query } from '@nestjs/common';
import { ProductsService } from '@/products/products.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Observable, fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiTags, ApiOperation, ApiBody, ApiQuery } from '@nestjs/swagger';

@ApiTags('products')
@Controller('api/products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly eventEmitter: EventEmitter2
  ) { }

  @Get()
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'category', required: false, type: String })
  async getProducts(
    @Query('search') search?: string,
    @Query('category') category?: string,
  ) {
    const products = await this.productsService.findAll(search, category);
    return products.map(p => ({
      id: p.id,
      title: p.name,
      subtitle: p.subtitle,
      category: p.category,
      priceRub: p.price,
      oldPriceRub: p.oldPrice,
      imageUrl: p.image,
      stock: p.stock,
    }));
  }

  @Sse('stream')
  streamProducts(): Observable<MessageEvent> {
    return fromEvent(this.eventEmitter, 'product.updated').pipe(
      map((payload: unknown) => {
        return { data: payload as { sku: string } } as MessageEvent;
      })
    );
  }

  @Get(':sku')
  async getProduct(@Param('sku') sku: string) {
    const p = await this.productsService.findOneDetailed(sku);
    return {
      id: p.id,
      title: p.name,
      subtitle: p.subtitle,
      category: p.category,
      priceRub: p.price,
      oldPriceRub: p.oldPrice,
      imageUrl: p.image,
      stock: p.stock,
    };
  }
}

@ApiTags('admin')
@Controller('api/admin/products')
export class AdminProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @ApiOperation({ summary: 'Update product price/stock (trigger SSE)' })
  @ApiBody({ schema: { example: { price: 5000, oldPrice: 6000, stock: 3 } } })
  @Post(':sku/update')
  async updateProduct(@Param('sku') sku: string, @Body() data: { price?: number; oldPrice?: number; stock?: number }) {
    await this.productsService.updateProduct(sku, data);
    return { ok: true };
  }
}
