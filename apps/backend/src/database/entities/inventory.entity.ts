import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('inventory')
export class InventoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  sku: string;

  @Column({ unique: true })
  code: string;

  @Column({ default: 'available' })
  status: string;

  @Column({ type: 'varchar', nullable: true, unique: true })
  orderId: string | null;

  @Column({ type: 'varchar', nullable: true, unique: true })
  requestId: string | null;

  @Column({ type: 'varchar', nullable: true })
  provider: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
