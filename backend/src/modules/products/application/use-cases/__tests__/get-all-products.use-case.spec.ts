import { Test, TestingModule } from '@nestjs/testing';
import { GetAllProductsUseCase } from '../get-all-products.use-case';
import { PRODUCT_REPOSITORY } from '../../../domain/repositories/product.repository';
import { Product } from '../../../domain/entities/product.entity';

describe('GetAllProductsUseCase', () => {
  let useCase: GetAllProductsUseCase;
  let mockProductRepository: any;

  beforeEach(async () => {
    mockProductRepository = {
      findAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAllProductsUseCase,
        {
          provide: PRODUCT_REPOSITORY,
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    useCase = module.get<GetAllProductsUseCase>(GetAllProductsUseCase);
  });

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
      Product.reconstitute({
        id: 'prod-2',
        name: 'Product 2',
        description: 'Description 2',
        price: 200,
        stock: 30,
        imageUrl: 'https://example.com/2.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    ];

    mockProductRepository.findAll.mockResolvedValue(products);

    const result = await useCase.execute();

    expect(result.isSuccess).toBe(true);
    expect(result.value).toHaveLength(2);
    expect(result.value[0].name).toBe('Product 1');
  });

  it('should return empty array when no products exist', async () => {
    mockProductRepository.findAll.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result.isSuccess).toBe(true);
    expect(result.value).toHaveLength(0);
  });
});
