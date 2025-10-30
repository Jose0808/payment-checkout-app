import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerSchema } from './infrastructure/persistence/customer.schema';
import { TypeOrmCustomerRepository } from './infrastructure/repositories/typeorm-customer.repository';
import { CUSTOMER_REPOSITORY } from './domain/repositories/customer.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerSchema])],
  providers: [
    {
      provide: CUSTOMER_REPOSITORY,
      useClass: TypeOrmCustomerRepository,
    },
  ],
  exports: [CUSTOMER_REPOSITORY],
})
export class CustomersModule {}
