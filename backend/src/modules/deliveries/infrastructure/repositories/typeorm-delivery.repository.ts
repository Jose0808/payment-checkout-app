import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IDeliveryRepository } from '../../domain/repositories/delivery.repository';
import { Delivery } from '../../domain/entities/delivery.entity';
import { DeliverySchema } from '../persistence/delivery.schema';

@Injectable()
export class TypeOrmDeliveryRepository implements IDeliveryRepository {
  constructor(
    @InjectRepository(DeliverySchema)
    private readonly repository: Repository<DeliverySchema>,
  ) {}

  async findById(id: string): Promise<Delivery | null> {
    const schema = await this.repository.findOne({ where: { id } });
    return schema ? this.toDomain(schema) : null;
  }

  async findByTransactionId(transactionId: string): Promise<Delivery | null> {
    const schema = await this.repository.findOne({ where: { transactionId } });
    return schema ? this.toDomain(schema) : null;
  }

  async save(delivery: Delivery): Promise<Delivery> {
    const schema = this.toSchema(delivery);
    const saved = await this.repository.save(schema);
    return this.toDomain(saved);
  }

  async update(delivery: Delivery): Promise<Delivery> {
    const schema = this.toSchema(delivery);
    await this.repository.update(delivery.id, schema);
    return delivery;
  }

  private toDomain(schema: DeliverySchema): Delivery {
    return Delivery.reconstitute({
      id: schema.id,
      transactionId: schema.transactionId,
      address: schema.address,
      city: schema.city,
      state: schema.state,
      zipCode: schema.zipCode,
      country: schema.country,
      notes: schema.notes,
      status: schema.status,
      estimatedDelivery: schema.estimatedDelivery,
      createdAt: schema.createdAt,
    });
  }

  private toSchema(delivery: Delivery): DeliverySchema {
    const schema = new DeliverySchema();
    schema.id = delivery.id;
    schema.transactionId = delivery.transactionId;
    schema.address = delivery.address;
    schema.city = delivery.city;
    schema.state = delivery.state;
    schema.zipCode = delivery.zipCode;
    schema.country = delivery.country;
    schema.notes = delivery.notes;
    schema.status = delivery.status;
    schema.estimatedDelivery = delivery.estimatedDelivery;
    schema.createdAt = delivery.createdAt;
    return schema;
  }
}
