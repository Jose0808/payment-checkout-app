import { Delivery } from '../entities/delivery.entity';

export interface IDeliveryRepository {
  findById(id: string): Promise<Delivery | null>;
  findByTransactionId(transactionId: string): Promise<Delivery | null>;
  save(delivery: Delivery): Promise<Delivery>;
  update(delivery: Delivery): Promise<Delivery>;
}

export const DELIVERY_REPOSITORY = Symbol('DELIVERY_REPOSITORY');
