import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsController } from './infrastructure/controllers/transactions.controller';
import { TransactionSchema } from './infrastructure/persistence/transaction.schema';
import { TypeOrmTransactionRepository } from './infrastructure/repositories/typeorm-transaction.repository';
import { CreateTransactionUseCase } from './application/use-cases/create-transaction.use-case';
import { ProcessPaymentUseCase } from './application/use-cases/process-payment.use-case';
import { GetTransactionUseCase } from './application/use-cases/get-transaction.use-case';
import { GetTransactionByNumberUseCase } from './application/use-cases/get-transaction-by-number.use-case';
import { WompiPaymentService } from './infrastructure/services/wompi-payment.service';
import { TRANSACTION_REPOSITORY } from './domain/repositories/transaction.repository';
import { PAYMENT_SERVICE } from './domain/services/payment.service.interface';
import { ProductsModule } from '../products/products.module';
import { CustomersModule } from '../customers/customers.module';
import { DeliveriesModule } from '../deliveries/deliveries.module';
import { AppConfigModule } from '@shared/infrastructure/config/app-config.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionSchema]),
    ProductsModule,
    CustomersModule,
    DeliveriesModule,
    AppConfigModule,
  ],
  controllers: [TransactionsController],
  providers: [
    {
      provide: TRANSACTION_REPOSITORY,
      useClass: TypeOrmTransactionRepository,
    },
    {
      provide: PAYMENT_SERVICE,
      useClass: WompiPaymentService,
    },
    CreateTransactionUseCase,
    ProcessPaymentUseCase,
    GetTransactionUseCase,
    GetTransactionByNumberUseCase,
  ],
  exports: [TRANSACTION_REPOSITORY],
})
export class TransactionsModule {}
