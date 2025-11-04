import { Inject, Injectable, Logger } from '@nestjs/common';
import { Result, DomainErrors } from '@shared/domain/result/result';
import {
  Transaction,
  TransactionStatus,
} from '../../domain/entities/transaction.entity';
import {
  ITransactionRepository,
  TRANSACTION_REPOSITORY,
} from '../../domain/repositories/transaction.repository';
import {
  IProductRepository,
  PRODUCT_REPOSITORY,
} from '../../../products/domain/repositories/product.repository';
import {
  IDeliveryRepository,
  DELIVERY_REPOSITORY,
} from '../../../deliveries/domain/repositories/delivery.repository';
import {
  IPaymentService,
  PAYMENT_SERVICE,
  PaymentRequest,
} from '../../domain/services/payment.service.interface';
import { Delivery } from '../../../deliveries/domain/entities/delivery.entity';
import { CUSTOMER_REPOSITORY, ICustomerRepository } from '@modules/customers/domain/repositories/customer.repository';

export interface ProcessPaymentDto {
  transactionId: string;
  cardNumber: string;
  cardHolder: string;
  expirationDate: string;
  cvv: string;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryState: string;
  deliveryZipCode: string;
  deliveryCountry: string;
  deliveryNotes?: string;
}

@Injectable()
export class ProcessPaymentUseCase {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepository,
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
    @Inject(DELIVERY_REPOSITORY)
    private readonly deliveryRepository: IDeliveryRepository,
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: ICustomerRepository,
    @Inject(PAYMENT_SERVICE)
    private readonly paymentService: IPaymentService,
  ) { }

  async execute(dto: ProcessPaymentDto): Promise<Result<Transaction>> {
    // 1. Get transaction
    const transaction = await this.transactionRepository.findById(
      dto.transactionId,
    );

    if (!transaction) {
      return Result.fail(
        DomainErrors.notFound('Transaction', dto.transactionId),
      );
    }

    if (transaction.status !== TransactionStatus.PENDING) {
      return Result.fail(
        DomainErrors.validation('Transaction is not in pending status'),
      );
    }

    // 2. Get customer
    const customer = await this.customerRepository.findById(
      transaction.customerId,
    );

    if (!customer) {
      return Result.fail(
        DomainErrors.notFound('Customer', transaction.customerId),
      );
    }

    // 3. Get product
    const product = await this.productRepository.findById(
      transaction.productId,
    );
    if (!product) {
      return Result.fail(
        DomainErrors.notFound('Product', transaction.productId),
      );
    }

    // 4. Check stock again
    if (!product.isAvailable(1)) {
      const declineResult = transaction.decline('Insufficient stock');
      if (declineResult.isFailure) {
        return Result.fail(declineResult.error);
      }
      await this.transactionRepository.update(transaction);
      return Result.fail(DomainErrors.insufficientStock(product.stock));
    }

    try {
      // 5. Process payment
      const paymentRequest: PaymentRequest = {
        amount: transaction.totalAmount,
        currency: 'COP',
        customerEmail: customer.email,
        reference: transaction.transactionNumber,
        cardNumber: dto.cardNumber,
        cardHolder: dto.cardHolder,
        expirationDate: dto.expirationDate,
        cvv: dto.cvv,
      };

      let paymentResponse =
        await this.paymentService.processPayment(paymentRequest);

      if (paymentResponse.status === 'PENDING') {
        Logger.log(`Transaction pending, simulating result in sandbox...` + paymentResponse.id);
        let cont = 1;
        while (paymentResponse.status === 'PENDING' && cont < 5) {
          await new Promise((resolve) => setTimeout(resolve, 3000));
          paymentResponse = await this.paymentService.getTransactionStatus(paymentResponse.id);
          cont++;
        }
      }

      // 6. Update transaction based on payment response
      if (paymentResponse.status === 'APPROVED') {
      Logger.log('Payment approved');
      const approveResult = transaction.approve(paymentResponse.id);
      if (approveResult.isFailure) {
        return Result.fail(approveResult.error);
      }

      // 7. Decrease stock
      const decreaseStockResult = product.decreaseStock(1);
      if (decreaseStockResult.isFailure) {
        return Result.fail(decreaseStockResult.error);
      }
      await this.productRepository.update(product);

      // 8. Create delivery
      const estimatedDelivery = new Date();
      estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

      const deliveryResult = Delivery.create({
        transactionId: transaction.id,
        address: dto.deliveryAddress,
        city: dto.deliveryCity,
        state: dto.deliveryState,
        zipCode: dto.deliveryZipCode,
        country: dto.deliveryCountry,
        notes: dto.deliveryNotes,
        estimatedDelivery,
      });

      if (deliveryResult.isFailure) {
        return Result.fail(deliveryResult.error);
      }

      await this.deliveryRepository.save(deliveryResult.value);
    } else if (paymentResponse.status === 'DECLINED') {
      const declineResult = transaction.decline(paymentResponse.message);
      if (declineResult.isFailure) {
        return Result.fail(declineResult.error);
      }
    } else {
      const errorResult = transaction.markAsError(
        paymentResponse.message || 'Unknown error',
      );
      if (errorResult.isFailure) {
        return Result.fail(errorResult.error);
      }
    }

    // 9. Save updated transaction
    const updatedTransaction =
      await this.transactionRepository.update(transaction);

    return Result.ok(updatedTransaction);
  } catch(error) {
    const errorResult = transaction.markAsError(
      error instanceof Error ? error.message : 'Payment processing failed',
    );
    if (errorResult.isFailure) {
      return Result.fail(errorResult.error);
    }

    await this.transactionRepository.update(transaction);
    return Result.fail(
      DomainErrors.paymentFailed(
        error instanceof Error ? error.message : 'Unknown error',
      ),
    );
  }
}
}
