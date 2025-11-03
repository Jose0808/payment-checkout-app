import { ProcessPaymentUseCase, ProcessPaymentDto } from '../process-payment.use-case';
import { Transaction, TransactionStatus } from '../../../domain/entities/transaction.entity';
import { Result } from '@shared/domain/result/result';

describe('ProcessPaymentUseCase', () => {
  let useCase: ProcessPaymentUseCase;
  let transactionRepository: any;
  let productRepository: any;
  let deliveryRepository: any;
  let customerRepository: any;
  let paymentService: any;

  const transactionMock = {
    id: 'txn1',
    productId: 'prod1',
    customerId: 'cust1',
    totalAmount: 100000,
    transactionNumber: 'TXN-001',
    status: TransactionStatus.PENDING,
    approve: jest.fn().mockReturnValue(Result.ok()),
    decline: jest.fn().mockReturnValue(Result.ok()),
    markAsError: jest.fn().mockReturnValue(Result.ok()),
  };

  const productMock = {
    id: 'prod1',
    stock: 10,
    isAvailable: jest.fn().mockReturnValue(true),
    decreaseStock: jest.fn().mockReturnValue(Result.ok()),
  };

  const customerMock = {
    id: 'cust1',
    email: 'customer@test.com',
  };

  const dto: ProcessPaymentDto = {
    transactionId: 'txn1',
    cardNumber: '4111111111111111',
    cardHolder: 'John Doe',
    expirationDate: '12/26',
    cvv: '123',
    deliveryAddress: '123 Main St',
    deliveryCity: 'Bogotá',
    deliveryState: 'Cundinamarca',
    deliveryZipCode: '110111',
    deliveryCountry: 'CO',
  };

  beforeEach(() => {
    transactionRepository = {
      findById: jest.fn(),
      update: jest.fn(),
    };

    productRepository = {
      findById: jest.fn(),
      update: jest.fn(),
    };

    deliveryRepository = {
      save: jest.fn(),
    };

    customerRepository = {
      findById: jest.fn(),
    };

    paymentService = {
      processPayment: jest.fn(),
      getTransactionStatus: jest.fn(),
    };

    useCase = new ProcessPaymentUseCase(
      transactionRepository,
      productRepository,
      deliveryRepository,
      customerRepository,
      paymentService,
    );
  });

  // ✅ Scenario 1: Transaction not found
  it('should fail if transaction does not exist', async () => {
    transactionRepository.findById.mockResolvedValue(null);

    const result = await useCase.execute(dto);

    expect(result.isFailure).toBe(true);
    expect(result.error.message).toContain('Transaction');
  });

  // ✅ Scenario 2: Customer not found
  it('should fail if customer is not found', async () => {
    transactionRepository.findById.mockResolvedValue(transactionMock);
    customerRepository.findById.mockResolvedValue(null);

    const result = await useCase.execute(dto);

    expect(result.isFailure).toBe(true);
    expect(result.error.message).toContain('Customer');
  });

  // ✅ Scenario 3: Product not found
  it('should fail if product is not found', async () => {
    transactionRepository.findById.mockResolvedValue(transactionMock);
    customerRepository.findById.mockResolvedValue(customerMock);
    productRepository.findById.mockResolvedValue(null);

    const result = await useCase.execute(dto);

    expect(result.isFailure).toBe(true);
    expect(result.error.message).toContain('Product');
  });

  // ✅ Scenario 4: Insufficient stock
  it('should fail if product is not available', async () => {
    const productNoStock = { ...productMock, isAvailable: jest.fn().mockReturnValue(false) };

    transactionRepository.findById.mockResolvedValue(transactionMock);
    customerRepository.findById.mockResolvedValue(customerMock);
    productRepository.findById.mockResolvedValue(productNoStock);

    const result = await useCase.execute(dto);

    expect(transactionMock.decline).toHaveBeenCalled();
    expect(result.isFailure).toBe(true);
  });

  // ✅ Scenario 5: Approved payment
  it('should approve and create delivery when payment is approved', async () => {
    transactionRepository.findById.mockResolvedValue(transactionMock);
    customerRepository.findById.mockResolvedValue(customerMock);
    productRepository.findById.mockResolvedValue(productMock);

    paymentService.processPayment.mockResolvedValue({
      id: 'pay1',
      status: 'APPROVED',
      reference: 'TXN-001',
      message: 'Payment approved successfully',
    });

    const result = await useCase.execute(dto);

    expect(result.isSuccess).toBe(true);
    expect(transactionMock.approve).toHaveBeenCalledWith('pay1');
    expect(productRepository.update).toHaveBeenCalled();
    expect(deliveryRepository.save).toHaveBeenCalled();
  });

  // ✅ Scenario 6: Declined payment
  it('should decline the transaction when payment is declined', async () => {
    transactionRepository.findById.mockResolvedValue(transactionMock);
    customerRepository.findById.mockResolvedValue(customerMock);
    productRepository.findById.mockResolvedValue(productMock);

    paymentService.processPayment.mockResolvedValue({
      id: 'pay2',
      status: 'DECLINED',
      reference: 'TXN-001',
      message: 'Insufficient funds',
    });

    const result = await useCase.execute(dto);

    expect(result.isSuccess).toBe(true);
    expect(transactionMock.decline).toHaveBeenCalledWith('Insufficient funds');
  });

  // ✅ Scenario 7: Payment error
  it('should mark transaction as error on exception', async () => {
    transactionRepository.findById.mockResolvedValue(transactionMock);
    customerRepository.findById.mockResolvedValue(customerMock);
    productRepository.findById.mockResolvedValue(productMock);

    paymentService.processPayment.mockRejectedValue(new Error('Service down'));

    const result = await useCase.execute(dto);

    expect(result.isFailure).toBe(true);
    expect(transactionMock.markAsError).toHaveBeenCalledWith('Service down');
  });
});
