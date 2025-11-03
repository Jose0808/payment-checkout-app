import { GetTransactionUseCase } from '../get-transaction.use-case';
import { ITransactionRepository } from '../../../domain/repositories/transaction.repository';
import { Transaction, TransactionStatus } from '../../../domain/entities/transaction.entity';
import { Result, DomainErrors } from '@shared/domain/result/result';

describe('GetTransactionUseCase', () => {
    let getTransactionUseCase: GetTransactionUseCase;
    let transactionRepository: jest.Mocked<ITransactionRepository>;

    beforeEach(() => {
        transactionRepository = {
            findById: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
        } as any;

        getTransactionUseCase = new GetTransactionUseCase(transactionRepository);
    });

    it('should return a transaction when found', async () => {
        // Arrange
        const mockTransaction = Transaction.reconstitute({
            id: 'txn_123',
            transactionNumber: 'TXN-TEST-001',
            productId: 'prod_1',
            customerId: 'cust_1',
            productAmount: 1000,
            baseFee: 50,
            deliveryFee: 25,
            totalAmount: 1075,
            status: TransactionStatus.PENDING,
            paymentMethod: 'CARD',
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        transactionRepository.findById.mockResolvedValue(mockTransaction);

        // Act
        const result = await getTransactionUseCase.execute('txn_123');

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(result.value).toEqual(mockTransaction);
        expect(transactionRepository.findById).toHaveBeenCalledWith('txn_123');
    });

    it('should return a failure when transaction not found', async () => {
        // Arrange
        transactionRepository.findById.mockResolvedValue(null);

        // Act
        const result = await getTransactionUseCase.execute('invalid_id');

        // Assert
        expect(result.isFailure).toBe(true);
        expect(result.error).toEqual(
            DomainErrors.notFound('Transaction', 'invalid_id'),
        );
        expect(transactionRepository.findById).toHaveBeenCalledWith('invalid_id');
    });

    it('should propagate repository errors as failures', async () => {
        // Arrange
        transactionRepository.findById.mockRejectedValue(
            new Error('Database connection failed'),
        );

        // Act
        let result: Result<Transaction>;
        try {
            result = await getTransactionUseCase.execute('txn_error');
        } catch (error) {
            // Assert
            expect(error.message).toBe('Database connection failed');
            expect(transactionRepository.findById).toHaveBeenCalledWith('txn_error');
        }
    });
});
