import { Inject, Injectable } from '@nestjs/common';
import { Result, DomainErrors } from '@shared/domain/result/result';
import { Product } from '../../domain/entities/product.entity';
import {
  IProductRepository,
  PRODUCT_REPOSITORY,
} from '../../domain/repositories/product.repository';

@Injectable()
export class GetProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(productId: string): Promise<Result<Product>> {
    const product = await this.productRepository.findById(productId);

    if (!product) {
      return Result.fail(DomainErrors.notFound('Product', productId));
    }

    return Result.ok(product);
  }
}
