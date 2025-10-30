import { Result, DomainErrors } from '@shared/domain/result/result';

export interface ProductProps {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Product {
  private constructor(private props: ProductProps) {}

  static create(
    props: Omit<ProductProps, 'id' | 'createdAt' | 'updatedAt'>,
  ): Result<Product> {
    const validation = this.validate(props);
    if (validation.isFailure) {
      return Result.fail<Product>(validation.error);
    }

    return Result.ok(
      new Product({
        ...props,
        id: crypto.randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    );
  }

  static reconstitute(props: ProductProps): Product {
    return new Product(props);
  }

  private static validate(props: Partial<ProductProps>): Result<void> {
    if (!props.name || props.name.trim().length === 0) {
      return Result.fail(DomainErrors.validation('Product name is required'));
    }

    if (props.price === undefined || props.price < 0) {
      return Result.fail(
        DomainErrors.validation('Product price must be positive'),
      );
    }

    if (props.stock === undefined || props.stock < 0) {
      return Result.fail(DomainErrors.validation('Stock must be non-negative'));
    }

    return Result.ok();
  }

  decreaseStock(quantity: number): Result<void> {
    if (quantity <= 0) {
      return Result.fail(DomainErrors.validation('Quantity must be positive'));
    }

    if (this.props.stock < quantity) {
      return Result.fail(DomainErrors.insufficientStock(this.props.stock));
    }

    this.props.stock -= quantity;
    this.props.updatedAt = new Date();
    return Result.ok();
  }

  increaseStock(quantity: number): Result<void> {
    if (quantity <= 0) {
      return Result.fail(DomainErrors.validation('Quantity must be positive'));
    }

    this.props.stock += quantity;
    this.props.updatedAt = new Date();
    return Result.ok();
  }

  isAvailable(quantity: number = 1): boolean {
    return this.props.stock >= quantity;
  }

  // Getters
  get id(): string {
    return this.props.id;
  }
  get name(): string {
    return this.props.name;
  }
  get description(): string {
    return this.props.description;
  }
  get price(): number {
    return this.props.price;
  }
  get stock(): number {
    return this.props.stock;
  }
  get imageUrl(): string {
    return this.props.imageUrl;
  }
  get createdAt(): Date {
    return this.props.createdAt;
  }
  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      price: this.price,
      stock: this.stock,
      imageUrl: this.imageUrl,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
