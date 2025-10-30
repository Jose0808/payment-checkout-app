import { Test, TestingModule } from '@nestjs/testing';
import { GetProductUseCase } from '../get-product.use-case';
import { PRODUCT_REPOSITORY } from '../../../domain/repositories/product.repository';
import { Product } from '../../../domain/entities/product.entity';

describe('GetProductUseCase', () => {
  let useCase: GetProductUseCase;
  let mockProductRepository: any;

  beforeEach(async () => {
    mockProductRepository = {
      findById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetProductUseCase,
        {
          provide: PRODUCT_REPOSITORY,
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    useCase = module.get<GetProductUseCase>(GetProductUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should return product when found', async () => {
    const productData = {
      id: 'prod-123',
      name: 'Test Product',
      description: 'Test Description',
      price: 100,
      stock: 50,
      imageUrl: 'https://example.com/image.jpg',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const product = Product.reconstitute(productData);
    mockProductRepository.findById.mockResolvedValue(product);

    const result = await useCase.execute('prod-123');

    expect(result.isSuccess).toBe(true);
    expect(result.value.id).toBe('prod-123');
    expect(mockProductRepository.findById).toHaveBeenCalledWith('prod-123');
  });

  it('should return error when product not found', async () => {
    mockProductRepository.findById.mockResolvedValue(null);

    const result = await useCase.execute('non-existent-id');

    expect(result.isFailure).toBe(true);
    expect(result.error.code).toBe('NOT_FOUND');
    expect(result.error.statusCode).toBe(404);
  });
});
