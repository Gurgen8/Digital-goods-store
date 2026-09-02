import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InventoryEntity } from '@/database/entities/inventory.entity';

@Injectable()
export class MockProvidersService {
  private readonly logger = new Logger(MockProvidersService.name);
  
  // Configure failure rate (0 to 1). e.g., 0.3 = 30% chance of failure/timeout
  public failureRateProviderA = 0.3;
  public failureRateProviderB = 0.1;

  constructor(private readonly dataSource: DataSource) {}

  async issue(providerName: 'ProviderA' | 'ProviderB', requestId: string, sku: string, orderId: string): Promise<{ status: 'ok'; code: string } | { status: 'error'; reason: string }> {
    this.logger.log(`[${providerName}] Received issue request: ${requestId} for SKU: ${sku}`);

    // Check idempotency FIRST (before deciding if we fail/timeout)
    // If we already issued a code for this requestId, we MUST return it, even if this attempt rolled a "fail"
    const existing = await this.dataSource.manager.findOne(InventoryEntity, { where: { requestId } });
    if (existing) {
      this.logger.log(`[${providerName}] Idempotency hit: Returning existing code for ${requestId}`);
      return { status: 'ok', code: existing.code };
    }

    // Roll for failure/timeout
    const rate = providerName === 'ProviderA' ? this.failureRateProviderA : this.failureRateProviderB;
    const rand = Math.random();

    if (rand < rate) {
      // 50% chance of 5xx, 50% chance of timeout
      if (Math.random() < 0.5) {
        this.logger.warn(`[${providerName}] Simulated 5xx error for ${requestId}`);
        return { status: 'error', reason: '500_internal_error' };
      } else {
        this.logger.warn(`[${providerName}] Simulated timeout for ${requestId}`);
        // We simulate a timeout by throwing an error or returning a special status
        // But crucially, a timeout means we might have processed it or not.
        // Let's say in 50% of timeouts, we ACTUALLY issued the code in the DB before timing out!
        if (Math.random() < 0.5) {
           await this.assignInventory(requestId, sku, orderId, providerName);
        }
        return { status: 'error', reason: 'timeout' };
      }
    }

    // Success path
    try {
      const code = await this.assignInventory(requestId, sku, orderId, providerName);
      if (!code) {
        return { status: 'error', reason: 'out_of_stock' };
      }
      return { status: 'ok', code };
    } catch (e) {
      this.logger.error(`[${providerName}] Error assigning inventory: ${e}`);
      return { status: 'error', reason: 'internal_error' };
    }
  }

  private async assignInventory(requestId: string, sku: string, orderId: string, provider: string): Promise<string | null> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // Check again inside transaction
      const existing = await queryRunner.manager.findOne(InventoryEntity, { where: { requestId }, lock: { mode: 'pessimistic_write' } });
      if (existing) {
        await queryRunner.commitTransaction();
        return existing.code;
      }

      const availableItem = await queryRunner.manager.createQueryBuilder(InventoryEntity, 'inventory')
        .where('inventory.sku = :sku', { sku })
        .andWhere('inventory.status = :status', { status: 'available' })
        .setLock('pessimistic_write')
        .setOnLocked('skip_locked')
        .getOne();

      if (!availableItem) {
        await queryRunner.rollbackTransaction();
        return null;
      }

      availableItem.status = 'used';
      availableItem.orderId = orderId;
      availableItem.requestId = requestId;
      availableItem.provider = provider;
      await queryRunner.manager.save(availableItem);

      await queryRunner.commitTransaction();
      return availableItem.code;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
