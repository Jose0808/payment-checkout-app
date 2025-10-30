import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TransactionStatus } from '../../domain/entities/transaction.entity';
import { ProductSchema } from '../../../products/infrastructure/persistence/product.schema';
import { CustomerSchema } from '../../../customers/infrastructure/persistence/customer.schema';

@Entity('transactions')
export class TransactionSchema {
  @PrimaryColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 100,
    unique: true,
    name: 'transaction_number',
  })
  transactionNumber: string;

  @Column({ type: 'uuid', name: 'product_id' })
  productId: string;

  @Column({ type: 'uuid', name: 'customer_id' })
  customerId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'product_amount' })
  productAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'base_fee' })
  baseFee: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'delivery_fee' })
  deliveryFee: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'total_amount' })
  totalAmount: number;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  status: TransactionStatus;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    name: 'wompi_transaction_id',
  })
  wompiTransactionId?: string;

  @Column({ type: 'varchar', length: 50, name: 'payment_method' })
  paymentMethod: string;

  @Column({ type: 'jsonb', nullable: true, name: 'payment_data' })
  paymentData?: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => ProductSchema)
  @JoinColumn({ name: 'product_id' })
  product: ProductSchema;

  @ManyToOne(() => CustomerSchema)
  @JoinColumn({ name: 'customer_id' })
  customer: CustomerSchema;
}
