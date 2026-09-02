import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('products')
export class ProductEntity {
  @PrimaryColumn()
  id: string;

  @Column({ unique: true })
  sku: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  subtitle: string;

  @Column()
  type: string;

  @Column('int')
  price: number; // Stored in minor units or just integers for rubles

  @Column({ nullable: true })
  oldPrice: number;

  @Column({ default: 'RUB' })
  currency: string;

  @Column()
  image: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
