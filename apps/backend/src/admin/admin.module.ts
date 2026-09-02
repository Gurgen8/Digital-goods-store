import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from '@/database/entities/order.entity';
import { AdminController } from '@/admin/admin.controller';
import { DeliveriesModule } from '@/deliveries/deliveries.module';
import { ProductEntity } from '@/database/entities/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity, ProductEntity]),
    DeliveriesModule,
  ],
  controllers: [AdminController],
})
export class AdminModule { }
