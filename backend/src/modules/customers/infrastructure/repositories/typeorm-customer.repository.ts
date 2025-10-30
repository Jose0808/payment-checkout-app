import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ICustomerRepository } from '../../domain/repositories/customer.repository';
import { Customer } from '../../domain/entities/customer.entity';
import { CustomerSchema } from '../persistence/customer.schema';

@Injectable()
export class TypeOrmCustomerRepository implements ICustomerRepository {
  constructor(
    @InjectRepository(CustomerSchema)
    private readonly repository: Repository<CustomerSchema>,
  ) {}

  async findById(id: string): Promise<Customer | null> {
    const schema = await this.repository.findOne({ where: { id } });
    return schema ? this.toDomain(schema) : null;
  }

  async findByEmail(email: string): Promise<Customer | null> {
    const schema = await this.repository.findOne({ where: { email } });
    return schema ? this.toDomain(schema) : null;
  }

  async save(customer: Customer): Promise<Customer> {
    const schema = this.toSchema(customer);
    const saved = await this.repository.save(schema);
    return this.toDomain(saved);
  }

  async update(customer: Customer): Promise<Customer> {
    const schema = this.toSchema(customer);
    await this.repository.update(customer.id, schema);
    return customer;
  }

  private toDomain(schema: CustomerSchema): Customer {
    return Customer.reconstitute({
      id: schema.id,
      email: schema.email,
      fullName: schema.fullName,
      phone: schema.phone,
      createdAt: schema.createdAt,
    });
  }

  private toSchema(customer: Customer): CustomerSchema {
    const schema = new CustomerSchema();
    schema.id = customer.id;
    schema.email = customer.email;
    schema.fullName = customer.fullName;
    schema.phone = customer.phone;
    schema.createdAt = customer.createdAt;
    return schema;
  }
}
