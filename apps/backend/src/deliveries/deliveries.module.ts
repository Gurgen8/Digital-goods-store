import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from '@/database/entities/order.entity';
import { InventoryEntity } from '@/database/entities/inventory.entity';
import { DeliveryEntity } from '@/database/entities/delivery.entity';
import { DeliveryAttemptEntity } from '@/database/entities/delivery-attempt.entity';
import { DeliveriesService } from '@/deliveries/deliveries.service';
import { MockProvidersService } from '@/deliveries/mock-providers.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderEntity,
      InventoryEntity,
      DeliveryEntity,
      DeliveryAttemptEntity,
    ]),
  ],
  providers: [DeliveriesService, MockProvidersService],
  exports: [DeliveriesService],
})
export class DeliveriesModule { }
