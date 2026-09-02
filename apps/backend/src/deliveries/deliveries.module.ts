import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from '@/database/entities/order.entity';
import { InventoryEntity } from '@/database/entities/inventory.entity';
import { DeliveryEntity } from '@/database/entities/delivery.entity';
import { DeliveryAttemptEntity } from '@/database/entities/delivery-attempt.entity';
import { DeliveriesService } from '@/deliveries/deliveries.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderEntity,
      InventoryEntity,
      DeliveryEntity,
      DeliveryAttemptEntity,
    ]),
  ],
  providers: [DeliveriesService],
  exports: [DeliveriesService],
})
export class DeliveriesModule { }
