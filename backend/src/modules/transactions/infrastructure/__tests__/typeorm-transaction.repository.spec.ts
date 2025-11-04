import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTransactionRepository } from '../repositories/typeorm-transaction.repository';
import { TransactionSchema } from '../persistence/transaction.schema';
import { Transaction, TransactionStatus } from '../../domain/entities/transaction.entity';

describe('TypeOrmTransactionRepository', () => {
    let repository: TypeOrmTransactionRepository;
    let typeormRepo: Repository<TransactionSchema>;

    const mockTransactionSchema: TransactionSchema = {
        id: '123e4567-e89b-12d3-a456-426614174003',
        transactionNumber: 'TRX-123456789',
        productId: 'prod-123',
        customerId: 'cust-123',
        productAmount: 50000,
        baseFee: 2000,
        deliveryFee: 5000,
        totalAmount: 57000,
        status: TransactionStatus.PENDING,
        wompiTransactionId: null,
        paymentMethod: 'CARD',
        paymentData: { cardType: 'VISA' },
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
    } as unknown as TransactionSchema;

    const mockTransaction = Transaction.reconstitute({
        id: '123e4567-e89b-12d3-a456-426614174003',
        transactionNumber: 'TRX-123456789',
        productId: 'prod-123',
        customerId: 'cust-123',
        productAmount: 50000,
        baseFee: 2000,
        deliveryFee: 5000,
        totalAmount: 57000,
        status: TransactionStatus.PENDING,
        wompiTransactionId: undefined,
        paymentMethod: 'CARD',
        paymentData: { cardType: 'VISA' },
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
    });

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TypeOrmTransactionRepository,
                {
                    provide: getRepositoryToken(TransactionSchema),
                    useValue: {
                        findOne: jest.fn(),
                        find: jest.fn(),
                        save: jest.fn(),
                        update: jest.fn(),
                    },
                },
            ],
        }).compile();

        repository = module.get<TypeOrmTransactionRepository>(TypeOrmTransactionRepository);
        typeormRepo = module.get<Repository<TransactionSchema>>(
            getRepositoryToken(TransactionSchema),
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(repository).toBeDefined();
    });

    describe('findById', () => {
        it('should find and return a transaction by id', async () => {
            jest.spyOn(typeormRepo, 'findOne').mockResolvedValue(mockTransactionSchema);

            const result = await repository.findById('123e4567-e89b-12d3-a456-426614174003');

            expect(result).toBeDefined();
            expect(result?.id).toBe('123e4567-e89b-12d3-a456-426614174003');
            expect(result?.transactionNumber).toBe('TRX-123456789');
            expect(result?.totalAmount).toBe(57000);
            expect(typeormRepo.findOne).toHaveBeenCalledWith({
                where: { id: '123e4567-e89b-12d3-a456-426614174003' },
            });
        });

        it('should return null when transaction is not found by id', async () => {
            jest.spyOn(typeormRepo, 'findOne').mockResolvedValue(null);

            const result = await repository.findById('non-existent-id');

            expect(result).toBeNull();
            expect(typeormRepo.findOne).toHaveBeenCalledWith({
                where: { id: 'non-existent-id' },
            });
        });
    });

    describe('findByTransactionNumber', () => {
        it('should find and return a transaction by transaction number', async () => {
            jest.spyOn(typeormRepo, 'findOne').mockResolvedValue(mockTransactionSchema);

            const result = await repository.findByTransactionNumber('TRX-123456789');

            expect(result).toBeDefined();
            expect(result?.transactionNumber).toBe('TRX-123456789');
            expect(result?.status).toBe(TransactionStatus.PENDING);
            expect(typeormRepo.findOne).toHaveBeenCalledWith({
                where: { transactionNumber: 'TRX-123456789' },
            });
        });

        it('should return null when transaction is not found by number', async () => {
            jest.spyOn(typeormRepo, 'findOne').mockResolvedValue(null);

            const result = await repository.findByTransactionNumber('TRX-999999');

            expect(result).toBeNull();
            expect(typeormRepo.findOne).toHaveBeenCalledWith({
                where: { transactionNumber: 'TRX-999999' },
            });
        });
    });

    describe('findByCustomerId', () => {
        it('should find and return all transactions for a customer', async () => {
            const mockTransactions = [
                mockTransactionSchema,
                { ...mockTransactionSchema, id: 'another-transaction-id' },
            ];
            jest.spyOn(typeormRepo, 'find').mockResolvedValue(mockTransactions);

            const result = await repository.findByCustomerId('cust-123');

            expect(result).toHaveLength(2);
            expect(result[0].customerId).toBe('cust-123');
            expect(typeormRepo.find).toHaveBeenCalledWith({
                where: { customerId: 'cust-123' },
            });
        });

        it('should return empty array when customer has no transactions', async () => {
            jest.spyOn(typeormRepo, 'find').mockResolvedValue([]);

            const result = await repository.findByCustomerId('cust-999');

            expect(result).toHaveLength(0);
            expect(typeormRepo.find).toHaveBeenCalledWith({
                where: { customerId: 'cust-999' },
            });
        });
    });

    describe('save', () => {
        it('should save a new transaction and return domain entity', async () => {
            jest.spyOn(typeormRepo, 'save').mockResolvedValue(mockTransactionSchema);

            const result = await repository.save(mockTransaction);

            expect(result).toBeDefined();
            expect(result.id).toBe('123e4567-e89b-12d3-a456-426614174003');
            expect(result.transactionNumber).toBe('TRX-123456789');
            expect(result.status).toBe(TransactionStatus.PENDING);
            expect(typeormRepo.save).toHaveBeenCalled();
        });

        it('should handle save with all transaction properties', async () => {
            jest.spyOn(typeormRepo, 'save').mockResolvedValue(mockTransactionSchema);

            const result = await repository.save(mockTransaction);

            expect(result.productAmount).toBe(50000);
            expect(result.baseFee).toBe(2000);
            expect(result.deliveryFee).toBe(5000);
            expect(result.totalAmount).toBe(57000);
            expect(result.paymentMethod).toBe('CARD');
            expect(typeormRepo.save).toHaveBeenCalledWith(
                expect.objectContaining({
                    transactionNumber: 'TRX-123456789',
                    productAmount: 50000,
                    totalAmount: 57000,
                }),
            );
        });

        it('should handle saving transaction with wompi id', async () => {
            const approvedTransaction = {
                ...mockTransactionSchema,
                status: TransactionStatus.APPROVED,
                wompiTransactionId: 'wompi-12345',
            };
            jest.spyOn(typeormRepo, 'save').mockResolvedValue(approvedTransaction);

            const transaction = Transaction.reconstitute({
                ...mockTransaction,
                status: TransactionStatus.APPROVED,
                wompiTransactionId: 'wompi-12345',
                id: '',
                transactionNumber: '',
                productId: '',
                customerId: '',
                productAmount: 0,
                baseFee: 0,
                deliveryFee: 0,
                totalAmount: 0,
                paymentMethod: '',
                createdAt: new Date(),
                updatedAt: new Date()
            });

            const result = await repository.save(transaction);

            expect(result.wompiTransactionId).toBe('wompi-12345');
            expect(result.status).toBe(TransactionStatus.APPROVED);
        });
    });

    describe('update', () => {
        it('should update an existing transaction', async () => {
            jest.spyOn(typeormRepo, 'update').mockResolvedValue({} as any);

            const result = await repository.update(mockTransaction);

            expect(result).toBeDefined();
            expect(result.id).toBe(mockTransaction.id);
            expect(typeormRepo.update).toHaveBeenCalledWith(
                mockTransaction.id,
                expect.objectContaining({
                    transactionNumber: mockTransaction.transactionNumber,
                    status: mockTransaction.status,
                }),
            );
        });

        it('should return the same transaction entity after update', async () => {
            jest.spyOn(typeormRepo, 'update').mockResolvedValue({} as any);

            const result = await repository.update(mockTransaction);

            expect(result).toBe(mockTransaction);
        });

        it('should update transaction status', async () => {
            const approvedTransaction = Transaction.reconstitute({
                ...mockTransaction,
                status: TransactionStatus.APPROVED,
                id: '',
                transactionNumber: '',
                productId: '',
                customerId: '',
                productAmount: 0,
                baseFee: 0,
                deliveryFee: 0,
                totalAmount: 0,
                paymentMethod: '',
                createdAt: new Date(),
                updatedAt: new Date()
            });

            jest.spyOn(typeormRepo, 'update').mockResolvedValue({} as any);

            const result = await repository.update(approvedTransaction);

            expect(result.status).toBe(TransactionStatus.APPROVED);
            expect(typeormRepo.update).toHaveBeenCalledWith(
                approvedTransaction.id,
                expect.objectContaining({
                    status: TransactionStatus.APPROVED,
                }),
            );
        });
    });

    describe('toDomain conversion', () => {
        it('should correctly convert numeric fields from schema', async () => {
            const schemaWithStringNumbers = {
                ...mockTransactionSchema,
                productAmount: '50000',
                baseFee: '2000',
                deliveryFee: '5000',
                totalAmount: '57000',
            };

            jest.spyOn(typeormRepo, 'findOne').mockResolvedValue(schemaWithStringNumbers as any);

            const result = await repository.findById('123e4567-e89b-12d3-a456-426614174003');

            expect(result).toBeDefined();
            expect(typeof result?.productAmount).toBe('number');
            expect(result?.productAmount).toBe(50000);
            expect(typeof result?.totalAmount).toBe('number');
            expect(result?.totalAmount).toBe(57000);
        });
    });
});