import { Injectable, Logger, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentEventEntity } from '@/database/entities/payment-event.entity';
import { OrderEntity } from '@/database/entities/order.entity';
import { DeliveriesService } from '@/deliveries/deliveries.service';

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);

  constructor(
    @InjectRepository(PaymentEventEntity)
    private readonly paymentEventRepo: Repository<PaymentEventEntity>,
    @InjectRepository(OrderEntity)
    private readonly orderRepo: Repository<OrderEntity>,
    @Inject(forwardRef(() => DeliveriesService))
    private readonly deliveriesService: DeliveriesService,
  ) { }

  async processPaymentWebhook(payload: {
    event_id: string;
    order_id: string;
    status: 'paid' | 'failed';
    amount: number;
    currency: string;
    created_at: string;
  }) {
    // 1. Idempotently save the event
    let event: PaymentEventEntity;
    try {
      event = this.paymentEventRepo.create({
        eventId: payload.event_id,
        orderId: payload.order_id,
        status: payload.status,
        amount: payload.amount,
        currency: payload.currency,
        payload,
      });
      await this.paymentEventRepo.save(event);
    } catch (error: any) {
      if (error.code === '23505') { // Unique violation
        this.logger.log(`Webhook ${payload.event_id} already processed`);
        return;
      }
      throw error;
    }

    // 2. Process order
    await this.processEventForOrder(event);
  }

  async processPendingWebhooksForOrder(orderId: string) {
    const { IsNull } = await import('typeorm');
    const events = await this.paymentEventRepo.find({
      where: { orderId, processedAt: IsNull() },
      order: { createdAt: 'ASC' },
    });

    for (const event of events) {
      await this.processEventForOrder(event);
    }
  }

  private async processEventForOrder(event: PaymentEventEntity) {
    const order = await this.orderRepo.findOne({ where: { id: event.orderId } });
    if (!order) {
      this.logger.warn(`Order ${event.orderId} not found for event ${event.eventId}`);
      return;
    }

    if (order.status !== 'created') {
      this.logger.log(`Order ${order.id} already processed. Current status: ${order.status}`);
      event.processedAt = new Date();
      await this.paymentEventRepo.save(event);
      return;
    }

    if (event.status === 'failed') {
      order.status = 'payment_failed';
      await this.orderRepo.save(order);
      event.processedAt = new Date();
      await this.paymentEventRepo.save(event);
      return;
    }

    if (event.status === 'paid') {
      order.status = 'paid';
      await this.orderRepo.save(order);
      event.processedAt = new Date();
      await this.paymentEventRepo.save(event);

      // Trigger delivery
      this.deliveriesService.startDelivery(order.id).catch(e => {
        this.logger.error(`Delivery failed for order ${order.id}: ${e.message}`, e.stack);
      });
    }
  }
}
