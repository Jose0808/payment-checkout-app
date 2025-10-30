import { Inject, Injectable } from '@nestjs/common';
import { Result, DomainErrors } from '@shared/domain/result/result';
import { Transaction } from '../../domain/entities/transaction.entity';
import {
  ITransactionRepository,
  TRANSACTION_REPOSITORY,
} from '../../domain/repositories/transaction.repository';

@Injectable()
export class GetTransactionByNumberUseCase {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  async execute(transactionNumber: string): Promise<Result<Transaction>> {
    const transaction =
      await this.transactionRepository.findByTransactionNumber(
        transactionNumber,
      );

    if (!transaction) {
      return Result.fail(
        DomainErrors.notFound('Transaction', transactionNumber),
      );
    }

    return Result.ok(transaction);
  }
}
