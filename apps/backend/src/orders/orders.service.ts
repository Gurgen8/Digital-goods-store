import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity } from '@/database/entities/order.entity';
import { ProductEntity } from '@/database/entities/product.entity';
import { WebhooksService } from '@/webhooks/webhooks.service';
import { randomUUID } from 'crypto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepo: Repository<OrderEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepo: Repository<ProductEntity>,
    private readonly webhooksService: WebhooksService,
  ) { }

  async createOrder(productId: string, idempotencyKey?: string) {
    if (idempotencyKey) {
      const existing = await this.orderRepo.findOne({ where: { idempotencyKey } });
      if (existing) {
        return { orderId: existing.id };
      }
    }

    const product = await this.productRepo.findOne({ where: { id: productId } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const order = this.orderRepo.create({
      sku: product.sku,
      amount: product.price,
      currency: product.currency,
      status: 'created',
      idempotencyKey: idempotencyKey || undefined,
    });

    await this.orderRepo.save(order);

    // Process any webhooks that might have arrived before the order was created
    await this.webhooksService.processPendingWebhooksForOrder(order.id);

    return { orderId: order.id };
  }

  async getOrder(id: string) {
    const order = await this.orderRepo.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const product = await this.productRepo.findOne({ where: { sku: order.sku } });

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
      deliveryCode: order.deliveryCode,
    };
  }

  async mockPay(id: string, result: 'success' | 'failed') {
    const order = await this.orderRepo.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Since we don't have real payment, we trigger a mock webhook event.
    // In real life, the client redirects to payment gateway, which sends webhook.
    const eventId = `mock_evt_${randomUUID()}`;
    await this.webhooksService.processPaymentWebhook({
      event_id: eventId,
      order_id: id,
      status: result === 'success' ? 'paid' : 'failed',
      amount: order.amount,
      currency: order.currency,
      created_at: new Date().toISOString(),
    });

    return { ok: true };
  }
}
