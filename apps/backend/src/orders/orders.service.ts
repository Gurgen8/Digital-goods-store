import { Injectable, NotFoundException, ConflictException, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { OrderEntity } from '@/database/entities/order.entity';
import { ProductEntity } from '@/database/entities/product.entity';
import { PromoCodeEntity } from '@/database/entities/promo-code.entity';
import { InventoryEntity } from '@/database/entities/inventory.entity';
import { WebhooksService } from '@/webhooks/webhooks.service';
import { randomUUID } from 'crypto';

import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class OrdersService implements OnModuleInit {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepo: Repository<OrderEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepo: Repository<ProductEntity>,
    private readonly webhooksService: WebhooksService,
    private readonly dataSource: DataSource,
    private readonly eventEmitter: EventEmitter2,
  ) { }

  onModuleInit() {
    setInterval(() => this.releaseExpiredReservations(), 10000); // Check every 10 seconds
  }

  private async releaseExpiredReservations() {
    try {
      await this.dataSource.transaction(async manager => {
        // Find expired orders that are still in 'created' status
        const expiredOrders = await manager.createQueryBuilder(OrderEntity, 'o')
          .setLock('pessimistic_write')
          .where('o.status = :status', { status: 'created' })
          .andWhere('o.expiresAt < :now', { now: new Date() })
          .getMany();

        for (const order of expiredOrders) {
          order.status = 'expired';
          await manager.save(OrderEntity, order);

          // Release the inventory
          const inv = await manager.findOne(InventoryEntity, { where: { orderId: order.id, status: 'reserved' } });
          if (inv) {
            inv.status = 'available';
            inv.orderId = null;
            await manager.save(InventoryEntity, inv);

            this.eventEmitter.emit('product.updated', { sku: order.sku });
            this.logger.log(`Released expired reservation for order ${order.id}, sku: ${order.sku}`);
          }
        }
      });
    } catch (e) {
      this.logger.error('Error releasing expired reservations', e);
    }
  }


  async createOrder(productId: string, idempotencyKey?: string) {
    if (idempotencyKey) {
      const existing = await this.orderRepo.findOne({ where: { idempotencyKey } });
      if (existing) {
        return { orderId: existing.id, expiresAt: existing.expiresAt };
      }
    }

    const product = await this.productRepo.findOne({ where: { id: productId } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    let orderId: string;
    let expiresAt: Date;

    try {
      await this.dataSource.transaction(async manager => {
        // Find one available inventory
        const inv = await manager.createQueryBuilder(InventoryEntity, 'inv')
          .setLock('pessimistic_write')
          .setOnLocked('skip_locked')
          .where('inv.sku = :sku', { sku: product.sku })
          .andWhere('inv.status = :status', { status: 'available' })
          .limit(1)
          .getOne();

        if (!inv) {
          throw new ConflictException('Товар только что раскупили');
        }

        const expires = new Date(Date.now() + 90 * 1000); // 1 minute 30 seconds

        const order = manager.create(OrderEntity, {
          sku: product.sku,
          amount: product.price,
          currency: product.currency,
          status: 'created',
          idempotencyKey: idempotencyKey || undefined,
          expiresAt: expires,
        });

        await manager.save(OrderEntity, order);

        inv.status = 'reserved';
        inv.orderId = order.id;
        await manager.save(InventoryEntity, inv);

        orderId = order.id;
        expiresAt = expires;
      });
      // Emit event outside transaction to ensure other connections read committed data
      this.eventEmitter.emit('product.updated', { sku: product.sku });
    } catch (err: unknown) {
      if (err instanceof Error && 'code' in err && err.code === '23505' && idempotencyKey) {
        const existing = await this.orderRepo.findOne({ where: { idempotencyKey } });
        if (existing) {
          return { orderId: existing.id, expiresAt: existing.expiresAt };
        }
      }
      throw err;
    }

    // Process any webhooks that might have arrived before the order was created
    await this.webhooksService.processPendingWebhooksForOrder(orderId!);

    return { orderId: orderId!, expiresAt: expiresAt! };
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
      expiresAt: order.expiresAt ? order.expiresAt.toISOString() : undefined,
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

    if (result === 'success') {
      await this.dataSource.transaction(async manager => {
        const o = await manager.findOne(OrderEntity, { where: { id }, lock: { mode: 'pessimistic_write' } });
        if (!o || o.status !== 'created') return;

        if (o.expiresAt && o.expiresAt.getTime() < Date.now()) {
          throw new ConflictException('Время брони истекло, товар возвращен в продажу');
        }
      });
    }

    // Since we don't have real payment, we trigger a mock webhook event.
    // In real life, the client redirects to payment gateway, which sends webhook.
    const eventId = `mock_evt_${randomUUID()}`;
    // Delay webhook slightly to simulate real payment process
    setTimeout(() => {
      this.webhooksService.processPaymentWebhook({
        event_id: eventId,
        order_id: id,
        status: result === 'success' ? 'paid' : 'failed',
        amount: order.amount,
        currency: order.currency,
        created_at: new Date().toISOString(),
      }).catch(e => console.error(e));
    }, 1000);

    return { ok: true };
  }
}
