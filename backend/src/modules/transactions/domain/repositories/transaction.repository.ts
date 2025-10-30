import { Transaction } from '../entities/transaction.entity';

export interface ITransactionRepository {
  findById(id: string): Promise<Transaction | null>;
  findByTransactionNumber(
    transactionNumber: string,
  ): Promise<Transaction | null>;
  findByCustomerId(customerId: string): Promise<Transaction[]>;
  save(transaction: Transaction): Promise<Transaction>;
  update(transaction: Transaction): Promise<Transaction>;
}

export const TRANSACTION_REPOSITORY = Symbol('TRANSACTION_REPOSITORY');
