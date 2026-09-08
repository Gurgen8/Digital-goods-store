import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from '@/database/entities/product.entity';
import { InventoryEntity } from '@/database/entities/inventory.entity';
import { ProductsController, AdminProductsController } from '@/products/products.controller';
import { ProductsService } from '@/products/products.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity, InventoryEntity])],
  controllers: [ProductsController, AdminProductsController],
  providers: [ProductsService],
})
export class ProductsModule { }
