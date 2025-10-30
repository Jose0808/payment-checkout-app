import { Test, TestingModule } from '@nestjs/testing';
import { ProcessPaymentUseCase } from '../process-payment.use-case';
import { TRANSACTION_REPOSITORY } from '../../../domain/repositories/transaction.repository';
import { PRODUCT_REPOSITORY } from '../../../../products/domain/repositories/product.repository';
import { DELIVERY_REPOSITORY } from '../../../../deliveries/domain/repositories/delivery.repository';
import { PAYMENT_SERVICE } from '../../../domain/services/payment.service.interface';
import {
  Transaction,
  TransactionStatus,
} from '../../../domain/entities/transaction.entity';
import { Product } from '../../../../products/domain/entities/product.entity';

describe('ProcessPaymentUseCase', () => {
  let useCase: ProcessPaymentUseCase;
  let mockTransactionRepository: any;
  let mockProductRepository: any;
  let mockDeliveryRepository: any;
  let mockPaymentService: any;

  beforeEach(async () => {
    mockTransactionRepository = {
      findById: jest.fn(),
      update: jest.fn(),
    };

    mockProductRepository = {
      findById: jest.fn(),
      update: jest.fn(),
    };

    mockDeliveryRepository = {
      save: jest.fn(),
    };

    mockPaymentService = {
      processPayment: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProcessPaymentUseCase,
        {
          provide: TRANSACTION_REPOSITORY,
          useValue: mockTransactionRepository,
        },
        {
          provide: PRODUCT_REPOSITORY,
          useValue: mockProductRepository,
        },
        {
          provide: DELIVERY_REPOSITORY,
          useValue: mockDeliveryRepository,
        },
        {
          provide: PAYMENT_SERVICE,
          useValue: mockPaymentService,
        },
      ],
    }).compile();

    useCase = module.get<ProcessPaymentUseCase>(ProcessPaymentUseCase);
  });

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
      status: TransactionStatus.PENDING,
      paymentMethod: 'CARD',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const product = Product.reconstitute({
      id: 'prod-123',
      name: 'Test Product',
      description: 'Test Description',
      price: 100000,
      stock: 50,
      imageUrl: 'https://example.com/image.jpg',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    mockTransactionRepository.findById.mockResolvedValue(transaction);
    mockProductRepository.findById.mockResolvedValue(product);
    mockProductRepository.update.mockResolvedValue(product);
    mockTransactionRepository.update.mockImplementation((txn: any) =>
      Promise.resolve(txn),
    );
    mockDeliveryRepository.save.mockImplementation((del: any) =>
      Promise.resolve(del),
    );

    mockPaymentService.processPayment.mockResolvedValue({
      id: 'wompi-123',
      status: 'APPROVED',
      reference: 'TXN-ABC123',
      message: 'Payment approved',
    });

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

    const result = await useCase.execute(dto);

    expect(result.isSuccess).toBe(true);
    expect(result.value.status).toBe(TransactionStatus.APPROVED);
    expect(mockPaymentService.processPayment).toHaveBeenCalled();
    expect(mockDeliveryRepository.save).toHaveBeenCalled();
  });

  it('should handle declined payment', async () => {
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

    const product = Product.reconstitute({
      id: 'prod-123',
      name: 'Test Product',
      description: 'Test Description',
      price: 100000,
      stock: 50,
      imageUrl: 'https://example.com/image.jpg',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    mockTransactionRepository.findById.mockResolvedValue(transaction);
    mockProductRepository.findById.mockResolvedValue(product);
    mockTransactionRepository.update.mockImplementation((txn: any) =>
      Promise.resolve(txn),
    );

    mockPaymentService.processPayment.mockResolvedValue({
      id: '',
      status: 'DECLINED',
      reference: 'TXN-ABC123',
      message: 'Insufficient funds',
    });

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

    const result = await useCase.execute(dto);

    expect(result.isSuccess).toBe(true);
    expect(result.value.status).toBe(TransactionStatus.DECLINED);
  });

  it('should fail when transaction not found', async () => {
    mockTransactionRepository.findById.mockResolvedValue(null);

    const dto = {
      transactionId: 'non-existent',
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

    const result = await useCase.execute(dto);

    expect(result.isFailure).toBe(true);
    expect(result.error.code).toBe('NOT_FOUND');
  });
});
