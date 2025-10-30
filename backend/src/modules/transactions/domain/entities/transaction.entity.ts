import { Result, DomainErrors } from '@shared/domain/result/result';

export enum TransactionStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  DECLINED = 'DECLINED',
  ERROR = 'ERROR',
}

export interface TransactionProps {
  id: string;
  transactionNumber: string;
  productId: string;
  customerId: string;
  productAmount: number;
  baseFee: number;
  deliveryFee: number;
  totalAmount: number;
  status: TransactionStatus;
  wompiTransactionId?: string;
  paymentMethod: string;
  paymentData?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export class Transaction {
  private constructor(private props: TransactionProps) {}

  static create(
    props: Omit<
      TransactionProps,
      'id' | 'transactionNumber' | 'createdAt' | 'updatedAt' | 'status'
    >,
  ): Result<Transaction> {
    const validation = this.validate(props);
    if (validation.isFailure) {
      return Result.fail<Transaction>(validation.error);
    }

    const totalAmount = props.productAmount + props.baseFee + props.deliveryFee;

    return Result.ok(
      new Transaction({
        ...props,
        id: crypto.randomUUID(),
        transactionNumber: this.generateTransactionNumber(),
        totalAmount,
        status: TransactionStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    );
  }

  static reconstitute(props: TransactionProps): Transaction {
    return new Transaction(props);
  }

  private static validate(props: Partial<TransactionProps>): Result<void> {
    if (!props.productId) {
      return Result.fail(DomainErrors.validation('Product ID is required'));
    }

    if (!props.customerId) {
      return Result.fail(DomainErrors.validation('Customer ID is required'));
    }

    if (props.productAmount === undefined || props.productAmount <= 0) {
      return Result.fail(
        DomainErrors.validation('Product amount must be positive'),
      );
    }

    if (props.baseFee === undefined || props.baseFee < 0) {
      return Result.fail(
        DomainErrors.validation('Base fee must be non-negative'),
      );
    }

    if (props.deliveryFee === undefined || props.deliveryFee < 0) {
      return Result.fail(
        DomainErrors.validation('Delivery fee must be non-negative'),
      );
    }

    return Result.ok();
  }

  private static generateTransactionNumber(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `TXN-${timestamp}-${random}`.toUpperCase();
  }

  approve(wompiTransactionId: string): Result<void> {
    if (this.props.status !== TransactionStatus.PENDING) {
      return Result.fail(
        DomainErrors.validation('Only pending transactions can be approved'),
      );
    }

    this.props.status = TransactionStatus.APPROVED;
    this.props.wompiTransactionId = wompiTransactionId;
    this.props.updatedAt = new Date();
    return Result.ok();
  }

  decline(reason?: string): Result<void> {
    if (this.props.status !== TransactionStatus.PENDING) {
      return Result.fail(
        DomainErrors.validation('Only pending transactions can be declined'),
      );
    }

    this.props.status = TransactionStatus.DECLINED;
    if (reason) {
      this.props.paymentData = {
        ...this.props.paymentData,
        declineReason: reason,
      };
    }
    this.props.updatedAt = new Date();
    return Result.ok();
  }

  markAsError(error: string): Result<void> {
    this.props.status = TransactionStatus.ERROR;
    this.props.paymentData = { ...this.props.paymentData, error };
    this.props.updatedAt = new Date();
    return Result.ok();
  }

  // Getters
  get id(): string {
    return this.props.id;
  }
  get transactionNumber(): string {
    return this.props.transactionNumber;
  }
  get productId(): string {
    return this.props.productId;
  }
  get customerId(): string {
    return this.props.customerId;
  }
  get productAmount(): number {
    return this.props.productAmount;
  }
  get baseFee(): number {
    return this.props.baseFee;
  }
  get deliveryFee(): number {
    return this.props.deliveryFee;
  }
  get totalAmount(): number {
    return this.props.totalAmount;
  }
  get status(): TransactionStatus {
    return this.props.status;
  }
  get wompiTransactionId(): string | undefined {
    return this.props.wompiTransactionId;
  }
  get paymentMethod(): string {
    return this.props.paymentMethod;
  }
  get paymentData(): Record<string, any> | undefined {
    return this.props.paymentData;
  }
  get createdAt(): Date {
    return this.props.createdAt;
  }
  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  toJSON() {
    return {
      id: this.id,
      transactionNumber: this.transactionNumber,
      productId: this.productId,
      customerId: this.customerId,
      productAmount: this.productAmount,
      baseFee: this.baseFee,
      deliveryFee: this.deliveryFee,
      totalAmount: this.totalAmount,
      status: this.status,
      wompiTransactionId: this.wompiTransactionId,
      paymentMethod: this.paymentMethod,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
