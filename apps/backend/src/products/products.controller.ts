import { Controller, Get, Sse, Post, Body, Param } from '@nestjs/common';
import { ProductsService } from '@/products/products.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Observable, fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';

@ApiTags('products')
@Controller('api/products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly eventEmitter: EventEmitter2
  ) { }

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
      stock: p.stock,
    }));
  }

  @Sse('stream')
  streamProducts(): Observable<MessageEvent> {
    return fromEvent(this.eventEmitter, 'product.updated').pipe(
      map((payload: any) => {
        return { data: payload } as MessageEvent;
      })
    );
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
