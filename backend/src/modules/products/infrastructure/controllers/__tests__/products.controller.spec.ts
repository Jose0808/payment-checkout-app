import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from '../products.controller';
import { GetProductUseCase } from '../../../application/use-cases/get-product.use-case';
import { GetAllProductsUseCase } from '../../../application/use-cases/get-all-products.use-case';
import { Product } from '../../../domain/entities/product.entity';
import { Result, DomainErrors } from '@shared/domain/result/result';

describe('ProductsController', () => {
  let controller: ProductsController;
  let getProductUseCase: GetProductUseCase;
  let getAllProductsUseCase: GetAllProductsUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: GetProductUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: GetAllProductsUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    getProductUseCase = module.get<GetProductUseCase>(GetProductUseCase);
    getAllProductsUseCase = module.get<GetAllProductsUseCase>(
      GetAllProductsUseCase,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllProducts', () => {
    it('should return all products', async () => {
      const products = [
        Product.reconstitute({
          id: 'prod-1',
          name: 'Product 1',
          description: 'Description 1',
          price: 100,
          stock: 50,
          imageUrl: 'https://example.com/1.jpg',
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      ];

      jest
        .spyOn(getAllProductsUseCase, 'execute')
        .mockResolvedValue(Result.ok(products));

      const result = await controller.getAllProducts();

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Product 1');
    });

    it('should throw error when use case fails', async () => {
      jest
        .spyOn(getAllProductsUseCase, 'execute')
        .mockResolvedValue(
          Result.fail(DomainErrors.internal('Database error')),
        );

      await expect(controller.getAllProducts()).rejects.toThrow();
    });
  });

  describe('getProduct', () => {
    it('should return product by id', async () => {
      const product = Product.reconstitute({
        id: 'prod-123',
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        stock: 50,
        imageUrl: 'https://example.com/image.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      jest
        .spyOn(getProductUseCase, 'execute')
        .mockResolvedValue(Result.ok(product));

      const result = await controller.getProduct('prod-123');

      expect(result.id).toBe('prod-123');
      expect(result.name).toBe('Test Product');
    });

    it('should throw 404 when product not found', async () => {
      jest
        .spyOn(getProductUseCase, 'execute')
        .mockResolvedValue(
          Result.fail(DomainErrors.notFound('Product', 'prod-123')),
        );

      await expect(controller.getProduct('prod-123')).rejects.toThrow();
    });
  });
});
