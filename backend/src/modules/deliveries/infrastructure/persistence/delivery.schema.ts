import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { DeliveryStatus } from '../../domain/entities/delivery.entity';
import { TransactionSchema } from '../../../transactions/infrastructure/persistence/transaction.schema';

@Entity('deliveries')
export class DeliverySchema {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'uuid', unique: true, name: 'transaction_id' })
  transactionId: string;

  @Column({ type: 'varchar', length: 200 })
  address: string;

  @Column({ type: 'varchar', length: 100 })
  city: string;

  @Column({ type: 'varchar', length: 100 })
  state: string;

  @Column({ type: 'varchar', length: 20, name: 'zip_code' })
  zipCode: string;

  @Column({ type: 'varchar', length: 100 })
  country: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({
    type: 'enum',
    enum: DeliveryStatus,
    default: DeliveryStatus.PENDING,
  })
  status: DeliveryStatus;

  @Column({ type: 'timestamp', name: 'estimated_delivery' })
  estimatedDelivery: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToOne(() => TransactionSchema)
  @JoinColumn({ name: 'transaction_id' })
  transaction: TransactionSchema;
}
