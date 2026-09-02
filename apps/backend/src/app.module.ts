import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from '@/database/entities/product.entity';
import { OrderEntity } from '@/database/entities/order.entity';
import { InventoryEntity } from '@/database/entities/inventory.entity';
import { PaymentEventEntity } from '@/database/entities/payment-event.entity';
import { DeliveryEntity } from '@/database/entities/delivery.entity';
import { DeliveryAttemptEntity } from '@/database/entities/delivery-attempt.entity';
import { PromoCodeEntity } from '@/database/entities/promo-code.entity';
import { ProductsModule } from '@/products/products.module';
import { OrdersModule } from '@/orders/orders.module';
import { WebhooksModule } from '@/webhooks/webhooks.module';
import { AdminModule } from '@/admin/admin.module';
import { SeedService } from '@/database/seed.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST || 'localhost',
      port: parseInt(process.env.POSTGRES_PORT || '5433', 10),
      username: process.env.POSTGRES_USER || 'admin',
      password: process.env.POSTGRES_PASSWORD || 'password',
      database: process.env.POSTGRES_DB || 'digital_goods',
      entities: [
        ProductEntity,
        OrderEntity,
        InventoryEntity,
        PaymentEventEntity,
        DeliveryEntity,
        DeliveryAttemptEntity,
        PromoCodeEntity,
      ],
      synchronize: true, // Auto-create schema for this test assignment
    }),
    TypeOrmModule.forFeature([ProductEntity, InventoryEntity, PromoCodeEntity]),
    ProductsModule,
    OrdersModule,
    WebhooksModule,
    AdminModule,
  ],
  providers: [SeedService],
})
export class AppModule {}
