import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from '@/database/entities/order.entity';
import { ProductEntity } from '@/database/entities/product.entity';
import { PaymentEventEntity } from '@/database/entities/payment-event.entity';
import { OrdersController } from '@/orders/orders.controller';
import { OrdersService } from '@/orders/orders.service';
import { WebhooksModule } from '@/webhooks/webhooks.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity, ProductEntity, PaymentEventEntity]),
    WebhooksModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule { }
