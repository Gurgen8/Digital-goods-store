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

  @Column({ nullable: true, unique: true })
  orderId: string;

  @Column({ nullable: true, unique: true })
  requestId: string;

  @Column({ nullable: true })
  provider: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
