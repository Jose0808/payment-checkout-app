import { Test, TestingModule } from '@nestjs/testing';
import { CreateTransactionUseCase } from '../create-transaction.use-case';
import { TRANSACTION_REPOSITORY } from '../../../domain/repositories/transaction.repository';
import { PRODUCT_REPOSITORY } from '../../../../products/domain/repositories/product.repository';
import { CUSTOMER_REPOSITORY } from '../../../../customers/domain/repositories/customer.repository';
import { Product } from '../../../../products/domain/entities/product.entity';
import { Customer } from '../../../../customers/domain/entities/customer.entity';

describe('CreateTransactionUseCase', () => {
  let useCase: CreateTransactionUseCase;
  let mockTransactionRepository: any;
  let mockProductRepository: any;
  let mockCustomerRepository: any;

  beforeEach(async () => {
    mockTransactionRepository = {
      save: jest.fn(),
    };

    mockProductRepository = {
      findById: jest.fn(),
    };

    mockCustomerRepository = {
      findByEmail: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateTransactionUseCase,
        {
          provide: TRANSACTION_REPOSITORY,
          useValue: mockTransactionRepository,
        },
        {
          provide: PRODUCT_REPOSITORY,
          useValue: mockProductRepository,
        },
        {
          provide: CUSTOMER_REPOSITORY,
          useValue: mockCustomerRepository,
        },
      ],
    }).compile();

    useCase = module.get<CreateTransactionUseCase>(CreateTransactionUseCase);
  });

  it('should create transaction with existing customer', async () => {
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

    const customer = Customer.reconstitute({
      id: 'cust-123',
      email: 'test@example.com',
      fullName: 'John Doe',
      phone: '+573001234567',
      createdAt: new Date(),
    });

    mockProductRepository.findById.mockResolvedValue(product);
    mockCustomerRepository.findByEmail.mockResolvedValue(customer);
    mockTransactionRepository.save.mockImplementation((txn: any) =>
      Promise.resolve(txn),
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

    const result = await useCase.execute(dto);

    expect(result.isSuccess).toBe(true);
    expect(result.value.productAmount).toBe(100000);
    expect(result.value.totalAmount).toBe(106000);
    expect(mockTransactionRepository.save).toHaveBeenCalled();
  });

  it('should create transaction and new customer', async () => {
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

    mockProductRepository.findById.mockResolvedValue(product);
    mockCustomerRepository.findByEmail.mockResolvedValue(null);
    mockCustomerRepository.save.mockImplementation((cust: any) =>
      Promise.resolve(cust),
    );
    mockTransactionRepository.save.mockImplementation((txn: any) =>
      Promise.resolve(txn),
    );

    const dto = {
      productId: 'prod-123',
      customerEmail: 'newcustomer@example.com',
      customerFullName: 'Jane Doe',
      customerPhone: '+573009876543',
      baseFee: 1000,
      deliveryFee: 5000,
      paymentMethod: 'CARD',
    };

    const result = await useCase.execute(dto);

    expect(result.isSuccess).toBe(true);
    expect(mockCustomerRepository.save).toHaveBeenCalled();
    expect(mockTransactionRepository.save).toHaveBeenCalled();
  });

  it('should fail when product not found', async () => {
    mockProductRepository.findById.mockResolvedValue(null);

    const dto = {
      productId: 'non-existent',
      customerEmail: 'test@example.com',
      customerFullName: 'John Doe',
      customerPhone: '+573001234567',
      baseFee: 1000,
      deliveryFee: 5000,
      paymentMethod: 'CARD',
    };

    const result = await useCase.execute(dto);

    expect(result.isFailure).toBe(true);
    expect(result.error.code).toBe('NOT_FOUND');
  });

  it('should fail when product out of stock', async () => {
    const product = Product.reconstitute({
      id: 'prod-123',
      name: 'Test Product',
      description: 'Test Description',
      price: 100000,
      stock: 0,
      imageUrl: 'https://example.com/image.jpg',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    mockProductRepository.findById.mockResolvedValue(product);

    const dto = {
      productId: 'prod-123',
      customerEmail: 'test@example.com',
      customerFullName: 'John Doe',
      customerPhone: '+573001234567',
      baseFee: 1000,
      deliveryFee: 5000,
      paymentMethod: 'CARD',
    };

    const result = await useCase.execute(dto);

    expect(result.isFailure).toBe(true);
    expect(result.error.code).toBe('INSUFFICIENT_STOCK');
  });
});
