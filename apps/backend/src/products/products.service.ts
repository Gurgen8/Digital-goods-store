import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, FindOptionsWhere } from 'typeorm';
import { ProductEntity } from '@/database/entities/product.entity';
import { InventoryEntity } from '@/database/entities/inventory.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepo: Repository<ProductEntity>,
    @InjectRepository(InventoryEntity)
    private readonly inventoryRepo: Repository<InventoryEntity>,
    private readonly eventEmitter: EventEmitter2,
  ) { }

  async findAll(search?: string, category?: string) {
    const where: FindOptionsWhere<ProductEntity> = {};
    if (search) {
      where.name = ILike(`%${search}%`);
    }
    if (category) {
      where.category = category;
    }

    const products = await this.productRepo.find({
      where,
      order: {
        createdAt: 'ASC'
      }
    });

    const skus = products.map(p => p.sku);
    if (skus.length === 0) return [];

    // Compute available stock for each product
    const counts = await this.inventoryRepo
      .createQueryBuilder('inv')
      .select('inv.sku', 'sku')
      .addSelect('COUNT(*)', 'count')
      .where('inv.status = :status', { status: 'available' })
      .andWhere('inv.sku IN (:...skus)', { skus })
      .groupBy('inv.sku')
      .getRawMany();

    const countMap = new Map<string, number>(
      counts.map(c => [c.sku, Number(c.count)]),
    );

    return products.map(p => ({
      ...p,
      stock: countMap.get(p.sku) || 0,
    }));
  }

  async findOneDetailed(sku: string) {
    const product = await this.productRepo.findOneBy({ sku });
    if (!product) {
      throw new NotFoundException(`Product with sku '${sku}' not found`);
    }

    const stock = await this.inventoryRepo.count({
      where: { sku, status: 'available' }
    });

    return {
      ...product,
      stock,
    };
  }

  async updateProduct(sku: string, data: { price?: number; oldPrice?: number; stock?: number }) {
    const product = await this.productRepo.findOneBy({ sku });
    if (!product) {
      throw new NotFoundException(`Product with sku '${sku}' not found`);
    }

    if (data.price !== undefined || data.oldPrice !== undefined) {
      const updateData: Partial<ProductEntity> = {};
      if (data.price !== undefined) updateData.price = data.price;
      if (data.oldPrice !== undefined) updateData.oldPrice = data.oldPrice;
      await this.productRepo.update({ sku }, updateData);
    }

    if (data.stock !== undefined) {
      // First, mark all existing available keys as issued to clear the current stock
      await this.inventoryRepo.update({ sku, status: 'available' }, { status: 'issued' });

      // If stock > 0, generate new mock keys to reach the exact requested stock
      if (data.stock > 0) {
        const newKeys = Array.from({ length: data.stock }).map(() => {
          return this.inventoryRepo.create({
            sku,
            code: `TEST-KEY-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
            status: 'available'
          });
        });
        await this.inventoryRepo.save(newKeys);
      }
    }

    // Broadcast change
    this.eventEmitter.emit('product.updated', { sku });
  }
}
