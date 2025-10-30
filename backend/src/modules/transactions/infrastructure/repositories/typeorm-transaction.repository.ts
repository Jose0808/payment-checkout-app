import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ITransactionRepository } from '../../domain/repositories/transaction.repository';
import { Transaction } from '../../domain/entities/transaction.entity';
import { TransactionSchema } from '../persistence/transaction.schema';

@Injectable()
export class TypeOrmTransactionRepository implements ITransactionRepository {
  constructor(
    @InjectRepository(TransactionSchema)
    private readonly repository: Repository<TransactionSchema>,
  ) {}

  async findById(id: string): Promise<Transaction | null> {
    const schema = await this.repository.findOne({ where: { id } });
    return schema ? this.toDomain(schema) : null;
  }

  async findByTransactionNumber(
    transactionNumber: string,
  ): Promise<Transaction | null> {
    const schema = await this.repository.findOne({
      where: { transactionNumber },
    });
    return schema ? this.toDomain(schema) : null;
  }

  async findByCustomerId(customerId: string): Promise<Transaction[]> {
    const schemas = await this.repository.find({ where: { customerId } });
    return schemas.map((schema) => this.toDomain(schema));
  }

  async save(transaction: Transaction): Promise<Transaction> {
    const schema = this.toSchema(transaction);
    const saved = await this.repository.save(schema);
    return this.toDomain(saved);
  }

  async update(transaction: Transaction): Promise<Transaction> {
    const schema = this.toSchema(transaction);
    await this.repository.update(transaction.id, schema);
    return transaction;
  }

  private toDomain(schema: TransactionSchema): Transaction {
    return Transaction.reconstitute({
      id: schema.id,
      transactionNumber: schema.transactionNumber,
      productId: schema.productId,
      customerId: schema.customerId,
      productAmount: Number(schema.productAmount),
      baseFee: Number(schema.baseFee),
      deliveryFee: Number(schema.deliveryFee),
      totalAmount: Number(schema.totalAmount),
      status: schema.status,
      wompiTransactionId: schema.wompiTransactionId,
      paymentMethod: schema.paymentMethod,
      paymentData: schema.paymentData,
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt,
    });
  }

  private toSchema(transaction: Transaction): TransactionSchema {
    const schema = new TransactionSchema();
    schema.id = transaction.id;
    schema.transactionNumber = transaction.transactionNumber;
    schema.productId = transaction.productId;
    schema.customerId = transaction.customerId;
    schema.productAmount = transaction.productAmount;
    schema.baseFee = transaction.baseFee;
    schema.deliveryFee = transaction.deliveryFee;
    schema.totalAmount = transaction.totalAmount;
    schema.status = transaction.status;
    schema.wompiTransactionId = transaction.wompiTransactionId;
    schema.paymentMethod = transaction.paymentMethod;
    schema.paymentData = transaction.paymentData;
    schema.createdAt = transaction.createdAt;
    schema.updatedAt = transaction.updatedAt;
    return schema;
  }
}
