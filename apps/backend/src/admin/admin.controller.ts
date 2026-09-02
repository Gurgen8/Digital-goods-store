import { Controller, Get, Post, Param, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { OrderEntity } from '@/database/entities/order.entity';
import { ProductEntity } from '@/database/entities/product.entity';
import { DeliveriesService } from '@/deliveries/deliveries.service';

@Controller('api/admin')
export class AdminController {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepo: Repository<OrderEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepo: Repository<ProductEntity>,
    private readonly deliveriesService: DeliveriesService,
  ) {}

  @Get('recovery-orders')
  async getRecoveryOrders() {
    const orders = await this.orderRepo.find({
      where: { status: In(['out_of_stock', 'delivery_failed']) },
    });

    const products = await this.productRepo.find();
    const productMap = new Map(products.map(p => [p.sku, p]));

    return orders.map(order => {
      const product = productMap.get(order.sku);
      return {
        id: order.id,
        product: {
          id: product?.id,
          title: product?.name,
          priceRub: product?.price,
          imageUrl: product?.image,
        },
        status: order.status,
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString(),
      };
    });
  }

  @Post('orders/:id/retry-delivery')
  async retryDelivery(@Param('id') id: string) {
    const order = await this.orderRepo.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status !== 'out_of_stock' && order.status !== 'delivery_failed') {
      throw new ConflictException('Order is not in a recoverable state');
    }

    // Trigger delivery retry safely
    await this.deliveriesService.startDelivery(order.id, true);

    return { ok: true };
  }
}
