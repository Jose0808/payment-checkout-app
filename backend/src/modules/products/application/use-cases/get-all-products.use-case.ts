import { Inject, Injectable } from '@nestjs/common';
import { Result } from '@shared/domain/result/result';
import { Product } from '../../domain/entities/product.entity';
import {
  IProductRepository,
  PRODUCT_REPOSITORY,
} from '../../domain/repositories/product.repository';

@Injectable()
export class GetAllProductsUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(): Promise<Result<Product[]>> {
    const products = await this.productRepository.findAll();
    return Result.ok(products);
  }
}
