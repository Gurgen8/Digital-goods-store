import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { OrderEntity } from '@/database/entities/order.entity';
import { InventoryEntity } from '@/database/entities/inventory.entity';
import { DeliveryEntity } from '@/database/entities/delivery.entity';
import { DeliveryAttemptEntity } from '@/database/entities/delivery-attempt.entity';
import { MockProvidersService } from '@/deliveries/mock-providers.service';
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
    private readonly mockProvidersService: MockProvidersService,
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
    // We try ProviderA first
    let res = await this.mockProvidersService.issue('ProviderA', delivery.requestId, delivery.sku, order.id);
    
    // If ProviderA fails, fallback to ProviderB
    if (res.status === 'error' && res.reason !== 'out_of_stock') {
      this.logger.warn(`ProviderA failed/timeout for ${delivery.requestId}, falling back to ProviderB`);
      // Register attempt for ProviderA as failed
      await this.attemptRepo.update({ requestId: delivery.requestId, provider: 'ProviderA' }, { status: 'failed', error: res.reason });
      
      // Create new attempt for ProviderB
      delivery.provider = 'ProviderB';
      await this.deliveryRepo.save(delivery);
      
      const fallbackAttempt = this.attemptRepo.create({
        orderId: order.id,
        requestId: delivery.requestId,
        provider: 'ProviderB',
        status: 'started',
      });
      await this.attemptRepo.save(fallbackAttempt);
      
      res = await this.mockProvidersService.issue('ProviderB', delivery.requestId, delivery.sku, order.id);
    }

    if (res.status === 'error') {
      if (res.reason === 'out_of_stock') {
        delivery.status = 'failed';
        await this.deliveryRepo.save(delivery);
        order.status = 'out_of_stock';
        await this.orderRepo.save(order);
      } else {
        // Both providers failed (or ProviderB failed)
        await this.attemptRepo.update({ requestId: delivery.requestId, provider: delivery.provider }, { status: 'failed', error: res.reason });
        delivery.status = 'failed';
        await this.deliveryRepo.save(delivery);
        order.status = 'delivery_failed';
        await this.orderRepo.save(order);
      }
      return;
    }

    // Success
    await this.attemptRepo.update({ requestId: delivery.requestId, provider: delivery.provider }, { status: 'success' });
    delivery.status = 'success';
    delivery.code = res.code;
    await this.deliveryRepo.save(delivery);

    order.status = 'delivered';
    order.deliveryCode = res.code;
    await this.orderRepo.save(order);
  }
}
