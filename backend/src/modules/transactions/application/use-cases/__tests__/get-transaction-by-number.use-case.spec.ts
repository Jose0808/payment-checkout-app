import { GetTransactionByNumberUseCase } from '../get-transaction-by-number.use-case';
import { ITransactionRepository } from '../../../domain/repositories/transaction.repository';
import { Transaction, TransactionStatus } from '../../../domain/entities/transaction.entity';
import { Result } from '@shared/domain/result/result';
import { DomainErrors } from '@shared/domain/result/result';

describe('GetTransactionByNumberUseCase', () => {
    let useCase: GetTransactionByNumberUseCase;
    let transactionRepository: jest.Mocked<ITransactionRepository>;

    beforeEach(() => {
        transactionRepository = {
            findByTransactionNumber: jest.fn(),
            findById: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        } as any;

        useCase = new GetTransactionByNumberUseCase(transactionRepository);
    });

    it('should return transaction when found', async () => {
        // Arrange
        const mockTransaction = Transaction.reconstitute({
            id: '1',
            transactionNumber: 'TXN-123',
            productId: 'p-1',
            customerId: 'c-1',
            productAmount: 1000,
            baseFee: 200,
            deliveryFee: 50,
            totalAmount: 1250,
            status: TransactionStatus.PENDING,
            paymentMethod: 'CARD',
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        transactionRepository.findByTransactionNumber.mockResolvedValue(mockTransaction);

        // Act
        const result = await useCase.execute('TXN-123');

        // Assert
        expect(result).toBeInstanceOf(Result);
        expect(result.isSuccess).toBe(true);
        expect(result.value).toEqual(mockTransaction);
        expect(transactionRepository.findByTransactionNumber).toHaveBeenCalledWith('TXN-123');
    });

    it('should return fail result when transaction not found', async () => {
        // Arrange
        transactionRepository.findByTransactionNumber.mockResolvedValue(null);

        // Act
        const result = await useCase.execute('TXN-999');

        // Assert
        expect(result).toBeInstanceOf(Result);
        expect(result.isFailure).toBe(true);
        expect(result.error).toEqual(
            DomainErrors.notFound('Transaction', 'TXN-999'),
        );
        expect(transactionRepository.findByTransactionNumber).toHaveBeenCalledWith('TXN-999');
    });
});
