import { Inject, Injectable } from '@nestjs/common';
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
    @Inject(PAYMENT_SERVICE)
    private readonly paymentService: IPaymentService,
  ) {}

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

    // 2. Get product
    const product = await this.productRepository.findById(
      transaction.productId,
    );
    if (!product) {
      return Result.fail(
        DomainErrors.notFound('Product', transaction.productId),
      );
    }

    // 3. Check stock again
    if (!product.isAvailable(1)) {
      const declineResult = transaction.decline('Insufficient stock');
      if (declineResult.isFailure) {
        return Result.fail(declineResult.error);
      }
      await this.transactionRepository.update(transaction);
      return Result.fail(DomainErrors.insufficientStock(product.stock));
    }

    try {
      // 4. Process payment
      const paymentRequest: PaymentRequest = {
        amount: transaction.totalAmount,
        currency: 'COP',
        customerEmail: '', // Get from customer
        reference: transaction.transactionNumber,
        cardNumber: dto.cardNumber,
        cardHolder: dto.cardHolder,
        expirationDate: dto.expirationDate,
        cvv: dto.cvv,
      };

      const paymentResponse =
        await this.paymentService.processPayment(paymentRequest);

      // 5. Update transaction based on payment response
      if (paymentResponse.status === 'APPROVED') {
        const approveResult = transaction.approve(paymentResponse.id);
        if (approveResult.isFailure) {
          return Result.fail(approveResult.error);
        }

        // 6. Decrease stock
        const decreaseStockResult = product.decreaseStock(1);
        if (decreaseStockResult.isFailure) {
          return Result.fail(decreaseStockResult.error);
        }
        await this.productRepository.update(product);

        // 7. Create delivery
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

      // 8. Save updated transaction
      const updatedTransaction =
        await this.transactionRepository.update(transaction);

      return Result.ok(updatedTransaction);
    } catch (error) {
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
