import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { OrderEntity } from '@/database/entities/order.entity';
import { ProductEntity } from '@/database/entities/product.entity';
import { PromoCodeEntity } from '@/database/entities/promo-code.entity';
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
    private readonly dataSource: DataSource,
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

    try {
      await this.orderRepo.save(order);
    } catch (err: unknown) {
      if (err instanceof Error && 'code' in err && err.code === '23505' && idempotencyKey) {
        const existing = await this.orderRepo.findOne({ where: { idempotencyKey } });
        if (existing) {
          return { orderId: existing.id };
        }
      }
      throw err;
    }

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
      amount: order.amount,
      originalAmount: order.originalAmount,
      promoCodeId: order.promoCodeId,
      status: order.status,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
      deliveryCode: order.deliveryCode,
    };
  }

  async applyPromo(orderId: string, code: string) {
    return this.dataSource.transaction(async (manager) => {
      const order = await manager.findOne(OrderEntity, {
        where: { id: orderId },
        lock: { mode: 'pessimistic_write' }
      });
      if (!order) throw new NotFoundException('Order not found');
      if (order.status !== 'created') throw new ConflictException('Order cannot be modified');
      if (order.promoCodeId) throw new ConflictException('Promo code already applied');

      // Use pessimistic write lock to handle concurrent requests applying the same promo
      const promo = await manager.findOne(PromoCodeEntity, {
        where: { code },
        lock: { mode: 'pessimistic_write' },
      });

      if (!promo) throw new NotFoundException('Invalid promo code');
      if (promo.usedCount >= promo.maxUses) throw new ConflictException('Promo code limit reached');

      let newAmount = order.amount;
      if (promo.type === 'percent') {
        newAmount = Math.max(0, order.amount - Math.floor((order.amount * promo.value) / 100));
      } else if (promo.type === 'amount') {
        // Assume promo currency matches order currency for simplicity
        newAmount = Math.max(0, order.amount - promo.value);
      }

      order.originalAmount = order.amount;
      order.amount = newAmount;
      order.promoCodeId = promo.id;
      await manager.save(OrderEntity, order);

      promo.usedCount += 1;
      await manager.save(PromoCodeEntity, promo);

      return { ok: true, newAmount };
    });
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
