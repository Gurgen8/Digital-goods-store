import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('orders')
export class OrderEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  sku: string;

  @Column('int')
  amount: number;

  @Column({ default: 'RUB' })
  currency: string;

  @Column()
  status: string;

  @Column({ nullable: true, unique: true })
  idempotencyKey: string;

  @Column({ nullable: true })
  deliveryCode: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
