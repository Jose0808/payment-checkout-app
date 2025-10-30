import { Transaction, TransactionStatus } from '../transaction.entity';

describe('Transaction Entity', () => {
  const validTransactionData = {
    productId: 'prod-123',
    customerId: 'cust-123',
    productAmount: 100000,
    baseFee: 1000,
    deliveryFee: 5000,
    paymentMethod: 'CARD',
    totalAmount: 100000,
  };

  describe('create', () => {
    it('should create a valid transaction', () => {
      const result = Transaction.create(validTransactionData);

      expect(result.isSuccess).toBe(true);
      expect(result.value.status).toBe(TransactionStatus.PENDING);
      expect(result.value.totalAmount).toBe(106000);
      expect(result.value.transactionNumber).toMatch(/^TXN-/);
    });

    it('should fail when productId is missing', () => {
      const result = Transaction.create({
        ...validTransactionData,
        productId: '',
        totalAmount: 0,
      });

      expect(result.isFailure).toBe(true);
      expect(result.error.code).toBe('VALIDATION_ERROR');
    });

    it('should fail when customerId is missing', () => {
      const result = Transaction.create({
        ...validTransactionData,
        customerId: '',
        totalAmount: 0,
      });

      expect(result.isFailure).toBe(true);
      expect(result.error.code).toBe('VALIDATION_ERROR');
    });

    it('should fail when productAmount is invalid', () => {
      const result = Transaction.create({
        ...validTransactionData,
        productAmount: 0,
        totalAmount: 0,
      });

      expect(result.isFailure).toBe(true);
      expect(result.error.code).toBe('VALIDATION_ERROR');
    });

    it('should calculate total amount correctly', () => {
      const result = Transaction.create({
        ...validTransactionData,
        productAmount: 50000,
        baseFee: 2000,
        deliveryFee: 3000,
        totalAmount: 0,
      });

      expect(result.isSuccess).toBe(true);
      expect(result.value.totalAmount).toBe(55000);
    });
  });

  describe('approve', () => {
    it('should approve a pending transaction', () => {
      const transactionResult = Transaction.create(validTransactionData);
      const transaction = transactionResult.value;

      const result = transaction.approve('wompi-123');

      expect(result.isSuccess).toBe(true);
      expect(transaction.status).toBe(TransactionStatus.APPROVED);
      expect(transaction.wompiTransactionId).toBe('wompi-123');
    });

    it('should fail to approve non-pending transaction', () => {
      const transactionResult = Transaction.create(validTransactionData);
      const transaction = transactionResult.value;

      transaction.approve('wompi-123');
      const result = transaction.approve('wompi-456');

      expect(result.isFailure).toBe(true);
      expect(result.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('decline', () => {
    it('should decline a pending transaction', () => {
      const transactionResult = Transaction.create(validTransactionData);
      const transaction = transactionResult.value;

      const result = transaction.decline('Insufficient funds');

      expect(result.isSuccess).toBe(true);
      expect(transaction.status).toBe(TransactionStatus.DECLINED);
    });

    it('should fail to decline non-pending transaction', () => {
      const transactionResult = Transaction.create(validTransactionData);
      const transaction = transactionResult.value;

      transaction.approve('wompi-123');
      const result = transaction.decline();

      expect(result.isFailure).toBe(true);
    });
  });

  describe('markAsError', () => {
    it('should mark transaction as error', () => {
      const transactionResult = Transaction.create(validTransactionData);
      const transaction = transactionResult.value;

      const result = transaction.markAsError('Payment gateway error');

      expect(result.isSuccess).toBe(true);
      expect(transaction.status).toBe(TransactionStatus.ERROR);
    });
  });
});
