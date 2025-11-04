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

        const result = await getTransactionUseCase.execute('txn_123');

        expect(result.isSuccess).toBe(true);
        expect(result.value).toEqual(mockTransaction);
        expect(result.error).toBeUndefined();
        expect(transactionRepository.findById).toHaveBeenCalledWith('txn_123');
    });

    it('should return a failure when transaction not found', async () => {
        transactionRepository.findById.mockResolvedValue(null);

        const result = await getTransactionUseCase.execute('invalid_id');

        expect(result.isFailure).toBe(true);
        expect(result.value).toBeUndefined();
        expect(result.error).toEqual(DomainErrors.notFound('Transaction', 'invalid_id'));
        expect(transactionRepository.findById).toHaveBeenCalledWith('invalid_id');
    });

    it('should return a failure when repository throws an error', async () => {
        const error = new Error('Database connection failed');
        transactionRepository.findById.mockRejectedValue(error);

        const result = await getTransactionUseCase.execute('txn_error');

        expect(result.isFailure).toBe(true);
        expect(result.value).toBeUndefined();
        expect(transactionRepository.findById).toHaveBeenCalledWith('txn_error');
    });

    it('should handle undefined transactionId gracefully', async () => {
        transactionRepository.findById.mockResolvedValue(null);

        const result = await getTransactionUseCase.execute(undefined as any);

        expect(result.isFailure).toBe(true);
        expect(result.error).toEqual(DomainErrors.notFound('Transaction', undefined));
        expect(transactionRepository.findById).toHaveBeenCalledWith(undefined);
    });

    it('should handle empty transactionId gracefully', async () => {
        transactionRepository.findById.mockResolvedValue(null);

        const result = await getTransactionUseCase.execute('');

        expect(result.isFailure).toBe(true);
        expect(result.error).toEqual(DomainErrors.notFound('Transaction', ''));
        expect(transactionRepository.findById).toHaveBeenCalledWith('');
    });

    it('should return failure when repository returns undefined', async () => {
        transactionRepository.findById.mockResolvedValue(null);

        const result = await getTransactionUseCase.execute('txn_undefined');

        expect(result.isFailure).toBe(true);
        expect(result.error).toEqual(DomainErrors.notFound('Transaction', 'txn_undefined'));
        expect(transactionRepository.findById).toHaveBeenCalledWith('txn_undefined');
    });

    it('should return failure when repository returns null', async () => {
        transactionRepository.findById.mockResolvedValue(null);

        const result = await getTransactionUseCase.execute('txn_null');

        expect(result.isFailure).toBe(true);
        expect(result.error).toEqual(DomainErrors.notFound('Transaction', 'txn_null'));
        expect(transactionRepository.findById).toHaveBeenCalledWith('txn_null');
    });
});