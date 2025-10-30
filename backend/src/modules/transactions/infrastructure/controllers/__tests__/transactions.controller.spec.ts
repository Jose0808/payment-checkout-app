import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from '../transactions.controller';
import { CreateTransactionUseCase } from '../../../application/use-cases/create-transaction.use-case';
import { ProcessPaymentUseCase } from '../../../application/use-cases/process-payment.use-case';
import { GetTransactionUseCase } from '../../../application/use-cases/get-transaction.use-case';
import { GetTransactionByNumberUseCase } from '../../../application/use-cases/get-transaction-by-number.use-case';
import {
  Transaction,
  TransactionStatus,
} from '../../../domain/entities/transaction.entity';
import { Result, DomainErrors } from '@shared/domain/result/result';

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let createTransactionUseCase: CreateTransactionUseCase;
  let processPaymentUseCase: ProcessPaymentUseCase;
  let getTransactionUseCase: GetTransactionUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        {
          provide: CreateTransactionUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: ProcessPaymentUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: GetTransactionUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: GetTransactionByNumberUseCase,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
    createTransactionUseCase = module.get<CreateTransactionUseCase>(
      CreateTransactionUseCase,
    );
    processPaymentUseCase = module.get<ProcessPaymentUseCase>(
      ProcessPaymentUseCase,
    );
    getTransactionUseCase = module.get<GetTransactionUseCase>(
      GetTransactionUseCase,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createTransaction', () => {
    it('should create a transaction', async () => {
      const transaction = Transaction.reconstitute({
        id: 'txn-123',
        transactionNumber: 'TXN-ABC123',
        productId: 'prod-123',
        customerId: 'cust-123',
        productAmount: 100000,
        baseFee: 1000,
        deliveryFee: 5000,
        totalAmount: 106000,
        status: TransactionStatus.PENDING,
        paymentMethod: 'CARD',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      jest
        .spyOn(createTransactionUseCase, 'execute')
        .mockResolvedValue(Result.ok(transaction));

      const dto = {
        productId: 'prod-123',
        customerEmail: 'test@example.com',
        customerFullName: 'John Doe',
        customerPhone: '+573001234567',
        baseFee: 1000,
        deliveryFee: 5000,
        paymentMethod: 'CARD',
      };

      const result = await controller.createTransaction(dto);

      expect(result.id).toBe('txn-123');
      expect(result.status).toBe(TransactionStatus.PENDING);
    });

    it('should throw error when product not found', async () => {
      jest
        .spyOn(createTransactionUseCase, 'execute')
        .mockResolvedValue(
          Result.fail(DomainErrors.notFound('Product', 'prod-123')),
        );

      const dto = {
        productId: 'prod-123',
        customerEmail: 'test@example.com',
        customerFullName: 'John Doe',
        customerPhone: '+573001234567',
        baseFee: 1000,
        deliveryFee: 5000,
        paymentMethod: 'CARD',
      };

      await expect(controller.createTransaction(dto)).rejects.toThrow();
    });
  });

  describe('processPayment', () => {
    it('should process payment successfully', async () => {
      const transaction = Transaction.reconstitute({
        id: 'txn-123',
        transactionNumber: 'TXN-ABC123',
        productId: 'prod-123',
        customerId: 'cust-123',
        productAmount: 100000,
        baseFee: 1000,
        deliveryFee: 5000,
        totalAmount: 106000,
        status: TransactionStatus.APPROVED,
        wompiTransactionId: 'wompi-123',
        paymentMethod: 'CARD',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      jest
        .spyOn(processPaymentUseCase, 'execute')
        .mockResolvedValue(Result.ok(transaction));

      const dto = {
        transactionId: 'txn-123',
        cardNumber: '4111111111111111',
        cardHolder: 'JOHN DOE',
        expirationDate: '12/25',
        cvv: '123',
        deliveryAddress: 'Calle 123 #45-67',
        deliveryCity: 'Bogotá',
        deliveryState: 'Cundinamarca',
        deliveryZipCode: '110111',
        deliveryCountry: 'Colombia',
      };

      const result = await controller.processPayment(dto);

      expect(result.status).toBe(TransactionStatus.APPROVED);
      expect(result.wompiTransactionId).toBe('wompi-123');
    });
  });

  describe('getTransaction', () => {
    it('should return transaction by id', async () => {
      const transaction = Transaction.reconstitute({
        id: 'txn-123',
        transactionNumber: 'TXN-ABC123',
        productId: 'prod-123',
        customerId: 'cust-123',
        productAmount: 100000,
        baseFee: 1000,
        deliveryFee: 5000,
        totalAmount: 106000,
        status: TransactionStatus.PENDING,
        paymentMethod: 'CARD',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      jest
        .spyOn(getTransactionUseCase, 'execute')
        .mockResolvedValue(Result.ok(transaction));

      const result = await controller.getTransaction('txn-123');

      expect(result.id).toBe('txn-123');
      expect(result.transactionNumber).toBe('TXN-ABC123');
    });

    it('should throw 404 when transaction not found', async () => {
      jest
        .spyOn(getTransactionUseCase, 'execute')
        .mockResolvedValue(
          Result.fail(DomainErrors.notFound('Transaction', 'txn-123')),
        );

      await expect(controller.getTransaction('txn-123')).rejects.toThrow();
    });
  });
});
