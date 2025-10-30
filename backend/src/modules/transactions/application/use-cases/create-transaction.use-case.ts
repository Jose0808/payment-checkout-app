import { Inject, Injectable } from '@nestjs/common';
import { Result, DomainErrors } from '@shared/domain/result/result';
import { Transaction } from '../../domain/entities/transaction.entity';
import {
  ITransactionRepository,
  TRANSACTION_REPOSITORY,
} from '../../domain/repositories/transaction.repository';
import {
  IProductRepository,
  PRODUCT_REPOSITORY,
} from '../../../products/domain/repositories/product.repository';
import {
  ICustomerRepository,
  CUSTOMER_REPOSITORY,
} from '../../../customers/domain/repositories/customer.repository';
import { Customer } from '../../../customers/domain/entities/customer.entity';

export interface CreateTransactionDto {
  productId: string;
  customerEmail: string;
  customerFullName: string;
  customerPhone: string;
  baseFee: number;
  deliveryFee: number;
  paymentMethod: string;
}

@Injectable()
export class CreateTransactionUseCase {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepository,
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: ICustomerRepository,
  ) {}

  async execute(dto: CreateTransactionDto): Promise<Result<Transaction>> {
    // 1. Validate product exists and has stock
    const product = await this.productRepository.findById(dto.productId);
    if (!product) {
      return Result.fail(DomainErrors.notFound('Product', dto.productId));
    }

    if (!product.isAvailable(1)) {
      return Result.fail(DomainErrors.insufficientStock(product.stock));
    }

    // 2. Get or create customer
    let customer = await this.customerRepository.findByEmail(dto.customerEmail);

    if (!customer) {
      const customerResult = Customer.create({
        email: dto.customerEmail,
        fullName: dto.customerFullName,
        phone: dto.customerPhone,
      });

      if (customerResult.isFailure) {
        return Result.fail(customerResult.error);
      }

      customer = await this.customerRepository.save(customerResult.value);
    }

    // 3. Create transaction
    const transactionResult = Transaction.create({
      productId: product.id,
      customerId: customer.id,
      productAmount: product.price,
      baseFee: dto.baseFee,
      deliveryFee: dto.deliveryFee,
      paymentMethod: dto.paymentMethod,
      totalAmount: 0,
    });

    if (transactionResult.isFailure) {
      return Result.fail(transactionResult.error);
    }

    // 4. Save transaction
    const savedTransaction = await this.transactionRepository.save(
      transactionResult.value,
    );

    return Result.ok(savedTransaction);
  }
}
