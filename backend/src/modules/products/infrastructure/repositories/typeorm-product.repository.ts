import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IProductRepository } from '../../domain/repositories/product.repository';
import { Product } from '../../domain/entities/product.entity';
import { ProductSchema } from '../persistence/product.schema';

@Injectable()
export class TypeOrmProductRepository implements IProductRepository {
  constructor(
    @InjectRepository(ProductSchema)
    private readonly repository: Repository<ProductSchema>,
  ) {}

  async findById(id: string): Promise<Product | null> {
    const schema = await this.repository.findOne({ where: { id } });
    return schema ? this.toDomain(schema) : null;
  }

  async findAll(): Promise<Product[]> {
    const schemas = await this.repository.find();
    return schemas.map((schema) => this.toDomain(schema));
  }

  async save(product: Product): Promise<Product> {
    const schema = this.toSchema(product);
    const saved = await this.repository.save(schema);
    return this.toDomain(saved);
  }

  async update(product: Product): Promise<Product> {
    const schema = this.toSchema(product);
    await this.repository.update(product.id, schema);
    return product;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  private toDomain(schema: ProductSchema): Product {
    return Product.reconstitute({
      id: schema.id,
      name: schema.name,
      description: schema.description,
      price: Number(schema.price),
      stock: schema.stock,
      imageUrl: schema.imageUrl,
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt,
    });
  }

  private toSchema(product: Product): ProductSchema {
    const schema = new ProductSchema();
    schema.id = product.id;
    schema.name = product.name;
    schema.description = product.description;
    schema.price = product.price;
    schema.stock = product.stock;
    schema.imageUrl = product.imageUrl;
    schema.createdAt = product.createdAt;
    schema.updatedAt = product.updatedAt;
    return schema;
  }
}
