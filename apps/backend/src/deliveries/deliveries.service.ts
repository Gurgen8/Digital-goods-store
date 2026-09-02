import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { OrderEntity } from '@/database/entities/order.entity';
import { InventoryEntity } from '@/database/entities/inventory.entity';
import { DeliveryEntity } from '@/database/entities/delivery.entity';
import { DeliveryAttemptEntity } from '@/database/entities/delivery-attempt.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class DeliveriesService {
  private readonly logger = new Logger(DeliveriesService.name);

  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepo: Repository<OrderEntity>,
    @InjectRepository(InventoryEntity)
    private readonly inventoryRepo: Repository<InventoryEntity>,
    @InjectRepository(DeliveryEntity)
    private readonly deliveryRepo: Repository<DeliveryEntity>,
    @InjectRepository(DeliveryAttemptEntity)
    private readonly attemptRepo: Repository<DeliveryAttemptEntity>,
    private readonly dataSource: DataSource,
  ) { }

  async startDelivery(orderId: string, forceRetry = false) {
    const order = await this.orderRepo.findOne({ where: { id: orderId } });
    if (!order) return;

    if (!forceRetry && (order.status === 'delivered' || order.status === 'out_of_stock' || order.status === 'delivery_failed')) {
      return;
    }

    if (forceRetry && order.status === 'delivered') {
      return;
    }

    order.status = 'delivering';
    await this.orderRepo.save(order);

    let delivery = await this.deliveryRepo.findOne({ where: { orderId } });
    if (!delivery) {
      delivery = this.deliveryRepo.create({
        orderId,
        sku: order.sku,
        requestId: `req_${orderId}_${randomUUID()}`,
        provider: 'ProviderA',
        status: 'pending',
      });
      await this.deliveryRepo.save(delivery);
    }

    const attempt = this.attemptRepo.create({
      orderId,
      requestId: delivery.requestId,
      provider: delivery.provider,
      status: 'started',
    });
    await this.attemptRepo.save(attempt);

    try {
      await this.issueInventory(delivery, order);
    } catch (e) {
      this.logger.error(`Failed to issue inventory for order ${order.id}`, e);
    }
  }

  private async issueInventory(delivery: DeliveryEntity, order: OrderEntity) {
    // Pessimistic locking transaction to assign inventory safely
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Double check delivery status
      const currentDelivery = await queryRunner.manager.findOne(DeliveryEntity, {
        where: { id: delivery.id },
        lock: { mode: 'pessimistic_write' },
      });

      if (!currentDelivery || currentDelivery.status === 'success') {
        await queryRunner.rollbackTransaction();
        return;
      }

      // 2. Find available inventory item and lock it using SKIP LOCKED
      // TypeORM's query builder allows pessimistic locks with skip locked
      const availableItem = await queryRunner.manager.createQueryBuilder(InventoryEntity, 'inventory')
        .where('inventory.sku = :sku', { sku: order.sku })
        .andWhere('inventory.status = :status', { status: 'available' })
        .setLock('pessimistic_write')
        .setOnLocked('skip_locked')
        .getOne();

      if (!availableItem) {
        // Out of stock
        currentDelivery.status = 'failed';
        await queryRunner.manager.save(currentDelivery);

        order.status = 'out_of_stock';
        await queryRunner.manager.save(order);

        await queryRunner.commitTransaction();
        return;
      }

      // 3. Assign item to order
      availableItem.status = 'used';
      availableItem.orderId = order.id;
      await queryRunner.manager.save(availableItem);

      currentDelivery.inventoryId = availableItem.id;
      currentDelivery.code = availableItem.code;
      currentDelivery.status = 'success';
      await queryRunner.manager.save(currentDelivery);

      order.status = 'delivered';
      order.deliveryCode = availableItem.code;
      await queryRunner.manager.save(order);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
