import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './infrastructure/controllers/products.controller';
import { ProductSchema } from './infrastructure/persistence/product.schema';
import { TypeOrmProductRepository } from './infrastructure/repositories/typeorm-product.repository';
import { GetProductUseCase } from './application/use-cases/get-product.use-case';
import { GetAllProductsUseCase } from './application/use-cases/get-all-products.use-case';
import { PRODUCT_REPOSITORY } from './domain/repositories/product.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ProductSchema])],
  controllers: [ProductsController],
  providers: [
    {
      provide: PRODUCT_REPOSITORY,
      useClass: TypeOrmProductRepository,
    },
    GetProductUseCase,
    GetAllProductsUseCase,
  ],
  exports: [PRODUCT_REPOSITORY],
})
export class ProductsModule {}
