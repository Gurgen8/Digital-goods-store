import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentEventEntity } from '@/database/entities/payment-event.entity';
import { OrderEntity } from '@/database/entities/order.entity';
import { WebhooksController } from '@/webhooks/webhooks.controller';
import { WebhooksService } from '@/webhooks/webhooks.service';
import { DeliveriesModule } from '@/deliveries/deliveries.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentEventEntity, OrderEntity]),
    forwardRef(() => DeliveriesModule),
  ],
  controllers: [WebhooksController],
  providers: [WebhooksService],
  exports: [WebhooksService],
})
export class WebhooksModule { }
