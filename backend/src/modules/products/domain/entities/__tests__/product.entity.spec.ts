import { Product } from '../product.entity';

describe('Product Entity', () => {
  describe('create', () => {
    it('should create a valid product', () => {
      const result = Product.create({
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        stock: 50,
        imageUrl: 'https://example.com/image.jpg',
      });

      expect(result.isSuccess).toBe(true);
      expect(result.value.name).toBe('Test Product');
      expect(result.value.price).toBe(100);
      expect(result.value.stock).toBe(50);
    });

    it('should fail when name is empty', () => {
      const result = Product.create({
        name: '',
        description: 'Test Description',
        price: 100,
        stock: 50,
        imageUrl: 'https://example.com/image.jpg',
      });

      expect(result.isFailure).toBe(true);
      expect(result.error.code).toBe('VALIDATION_ERROR');
      expect(result.error.message).toContain('name');
    });

    it('should fail when price is negative', () => {
      const result = Product.create({
        name: 'Test Product',
        description: 'Test Description',
        price: -10,
        stock: 50,
        imageUrl: 'https://example.com/image.jpg',
      });

      expect(result.isFailure).toBe(true);
      expect(result.error.code).toBe('VALIDATION_ERROR');
      expect(result.error.message).toContain('price');
    });

    it('should fail when stock is negative', () => {
      const result = Product.create({
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        stock: -5,
        imageUrl: 'https://example.com/image.jpg',
      });

      expect(result.isFailure).toBe(true);
      expect(result.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('decreaseStock', () => {
    it('should decrease stock successfully', () => {
      const productResult = Product.create({
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        stock: 50,
        imageUrl: 'https://example.com/image.jpg',
      });

      const product = productResult.value;
      const result = product.decreaseStock(10);

      expect(result.isSuccess).toBe(true);
      expect(product.stock).toBe(40);
    });

    it('should fail when quantity exceeds stock', () => {
      const productResult = Product.create({
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        stock: 5,
        imageUrl: 'https://example.com/image.jpg',
      });

      const product = productResult.value;
      const result = product.decreaseStock(10);

      expect(result.isFailure).toBe(true);
      expect(result.error.code).toBe('INSUFFICIENT_STOCK');
    });

    it('should fail when quantity is zero or negative', () => {
      const productResult = Product.create({
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        stock: 50,
        imageUrl: 'https://example.com/image.jpg',
      });

      const product = productResult.value;
      const result = product.decreaseStock(0);

      expect(result.isFailure).toBe(true);
      expect(result.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('increaseStock', () => {
    it('should increase stock successfully', () => {
      const productResult = Product.create({
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        stock: 50,
        imageUrl: 'https://example.com/image.jpg',
      });

      const product = productResult.value;
      const result = product.increaseStock(10);

      expect(result.isSuccess).toBe(true);
      expect(product.stock).toBe(60);
    });
  });

  describe('isAvailable', () => {
    it('should return true when stock is sufficient', () => {
      const productResult = Product.create({
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        stock: 50,
        imageUrl: 'https://example.com/image.jpg',
      });

      const product = productResult.value;
      expect(product.isAvailable(10)).toBe(true);
    });

    it('should return false when stock is insufficient', () => {
      const productResult = Product.create({
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        stock: 5,
        imageUrl: 'https://example.com/image.jpg',
      });

      const product = productResult.value;
      expect(product.isAvailable(10)).toBe(false);
    });
  });
});
