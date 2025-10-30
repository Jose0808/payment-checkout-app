import { Product } from '../entities/product.entity';

export interface IProductRepository {
  findById(id: string): Promise<Product | null>;
  findAll(): Promise<Product[]>;
  save(product: Product): Promise<Product>;
  update(product: Product): Promise<Product>;
  delete(id: string): Promise<void>;
}

export const PRODUCT_REPOSITORY = Symbol('PRODUCT_REPOSITORY');
