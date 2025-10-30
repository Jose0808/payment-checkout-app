import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliverySchema } from './infrastructure/persistence/delivery.schema';
import { TypeOrmDeliveryRepository } from './infrastructure/repositories/typeorm-delivery.repository';
import { DELIVERY_REPOSITORY } from './domain/repositories/delivery.repository';

@Module({
  imports: [TypeOrmModule.forFeature([DeliverySchema])],
  providers: [
    {
      provide: DELIVERY_REPOSITORY,
      useClass: TypeOrmDeliveryRepository,
    },
  ],
  exports: [DELIVERY_REPOSITORY],
})
export class DeliveriesModule {}
