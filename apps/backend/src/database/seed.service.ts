import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from '@/database/entities/product.entity';
import { InventoryEntity } from '@/database/entities/inventory.entity';
import { products } from '@/data/products';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepo: Repository<ProductEntity>,
    @InjectRepository(InventoryEntity)
    private readonly inventoryRepo: Repository<InventoryEntity>,
  ) {}

  async onApplicationBootstrap() {
    this.logger.log('Seeding data...');

    // Seed products
    for (const p of products) {
      const exists = await this.productRepo.findOne({ where: { sku: p.id } }); // Assuming id in products.ts is SKU
      if (!exists) {
        await this.productRepo.save({
          id: p.id,
          sku: p.id,
          name: p.title,
          subtitle: p.subtitle,
          type: 'key',
          price: p.priceRub,
          oldPrice: p.oldPriceRub,
          currency: 'RUB',
          image: p.imageUrl,
        });
      }
    }

    // Seed inventory for KEY-CS2-PRIME
    const keys = [
      'LFXC-TNCS-BPCD', 'P3EI-W8UO-9B4K', 'FEL3-GUXN-TCCH', 'YPLV-QK2Z-IUS5',
      '0K9E-P1FR-BY1U', '5LZV-UQ48-RXCZ', 'X93K-NYAQ-GEC1', 'EIO5-CQT5-35KO',
    ];

    for (const key of keys) {
      const exists = await this.inventoryRepo.findOne({ where: { code: key } });
      if (!exists) {
        await this.inventoryRepo.save({
          sku: 'KEY-CS2-PRIME', // Sample product
          code: key,
          status: 'available',
        });
      }
    }

    this.logger.log('Seeding completed.');
  }
}
