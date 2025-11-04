import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmProductRepository } from '../repositories/typeorm-product.repository';
import { ProductSchema } from '../persistence/product.schema';
import { Product } from '../../domain/entities/product.entity';

describe('TypeOrmProductRepository', () => {
    let repository: TypeOrmProductRepository;
    let typeormRepo: Repository<ProductSchema>;

    const mockProductSchema: ProductSchema = {
        id: '123e4567-e89b-12d3-a456-426614174002',
        name: 'Test Product',
        description: 'A test product description',
        price: 50000,
        stock: 10,
        imageUrl: 'https://example.com/product.jpg',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
    } as ProductSchema;

    const mockProduct = Product.reconstitute({
        id: '123e4567-e89b-12d3-a456-426614174002',
        name: 'Test Product',
        description: 'A test product description',
        price: 50000,
        stock: 10,
        imageUrl: 'https://example.com/product.jpg',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
    });

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TypeOrmProductRepository,
                {
                    provide: getRepositoryToken(ProductSchema),
                    useValue: {
                        findOne: jest.fn(),
                        find: jest.fn(),
                        save: jest.fn(),
                        update: jest.fn(),
                        delete: jest.fn(),
                    },
                },
            ],
        }).compile();

        repository = module.get<TypeOrmProductRepository>(TypeOrmProductRepository);
        typeormRepo = module.get<Repository<ProductSchema>>(
            getRepositoryToken(ProductSchema),
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(repository).toBeDefined();
    });

    describe('findById', () => {
        it('should find and return a product by id', async () => {
            jest.spyOn(typeormRepo, 'findOne').mockResolvedValue(mockProductSchema);

            const result = await repository.findById('123e4567-e89b-12d3-a456-426614174002');

            expect(result).toBeDefined();
            expect(result?.id).toBe('123e4567-e89b-12d3-a456-426614174002');
            expect(result?.name).toBe('Test Product');
            expect(result?.price).toBe(50000);
            expect(typeormRepo.findOne).toHaveBeenCalledWith({
                where: { id: '123e4567-e89b-12d3-a456-426614174002' },
            });
        });

        it('should return null when product is not found by id', async () => {
            jest.spyOn(typeormRepo, 'findOne').mockResolvedValue(null);

            const result = await repository.findById('non-existent-id');

            expect(result).toBeNull();
            expect(typeormRepo.findOne).toHaveBeenCalledWith({
                where: { id: 'non-existent-id' },
            });
        });
    });

    describe('findAll', () => {
        it('should return all products', async () => {
            const mockProducts = [mockProductSchema, { ...mockProductSchema, id: 'another-id' }];
            jest.spyOn(typeormRepo, 'find').mockResolvedValue(mockProducts);

            const result = await repository.findAll();

            expect(result).toHaveLength(2);
            expect(result[0].name).toBe('Test Product');
            expect(typeormRepo.find).toHaveBeenCalled();
        });

        it('should return empty array when no products exist', async () => {
            jest.spyOn(typeormRepo, 'find').mockResolvedValue([]);

            const result = await repository.findAll();

            expect(result).toHaveLength(0);
            expect(typeormRepo.find).toHaveBeenCalled();
        });
    });

    describe('save', () => {
        it('should save a new product and return domain entity', async () => {
            jest.spyOn(typeormRepo, 'save').mockResolvedValue(mockProductSchema);

            const result = await repository.save(mockProduct);

            expect(result).toBeDefined();
            expect(result.id).toBe('123e4567-e89b-12d3-a456-426614174002');
            expect(result.name).toBe('Test Product');
            expect(result.price).toBe(50000);
            expect(typeormRepo.save).toHaveBeenCalled();
        });

        it('should handle save with all product properties', async () => {
            jest.spyOn(typeormRepo, 'save').mockResolvedValue(mockProductSchema);

            const result = await repository.save(mockProduct);

            expect(result.description).toBe('A test product description');
            expect(result.stock).toBe(10);
            expect(result.imageUrl).toBe('https://example.com/product.jpg');
            expect(typeormRepo.save).toHaveBeenCalledWith(
                expect.objectContaining({
                    name: 'Test Product',
                    price: 50000,
                    stock: 10,
                }),
            );
        });
    });

    describe('update', () => {
        it('should update an existing product', async () => {
            jest.spyOn(typeormRepo, 'update').mockResolvedValue({} as any);

            const result = await repository.update(mockProduct);

            expect(result).toBeDefined();
            expect(result.id).toBe(mockProduct.id);
            expect(typeormRepo.update).toHaveBeenCalledWith(
                mockProduct.id,
                expect.objectContaining({
                    name: mockProduct.name,
                    price: mockProduct.price,
                }),
            );
        });

        it('should return the same product entity after update', async () => {
            jest.spyOn(typeormRepo, 'update').mockResolvedValue({} as any);

            const result = await repository.update(mockProduct);

            expect(result).toBe(mockProduct);
        });
    });

    describe('delete', () => {
        it('should delete a product by id', async () => {
            jest.spyOn(typeormRepo, 'delete').mockResolvedValue({} as any);

            await repository.delete('123e4567-e89b-12d3-a456-426614174002');

            expect(typeormRepo.delete).toHaveBeenCalledWith('123e4567-e89b-12d3-a456-426614174002');
        });

        it('should not throw error when deleting non-existent product', async () => {
            jest.spyOn(typeormRepo, 'delete').mockResolvedValue({} as any);

            await expect(repository.delete('non-existent-id')).resolves.not.toThrow();
            expect(typeormRepo.delete).toHaveBeenCalledWith('non-existent-id');
        });
    });
});