import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmDeliveryRepository } from '../repositories/typeorm-delivery.repository';
import { DeliverySchema } from '../persistence/delivery.schema';
import { Delivery, DeliveryStatus } from '../../domain/entities/delivery.entity';

describe('TypeOrmDeliveryRepository', () => {
    let repository: TypeOrmDeliveryRepository;
    let typeormRepo: Repository<DeliverySchema>;

    const mockDeliverySchema: DeliverySchema = {
        id: '123e4567-e89b-12d3-a456-426614174001',
        transactionId: 'TRX-123456',
        address: 'Calle 123 #45-67',
        city: 'Bogotá',
        state: 'Cundinamarca',
        zipCode: '110111',
        country: 'Colombia',
        notes: 'Delivery notes',
        status: DeliveryStatus.PENDING,
        estimatedDelivery: new Date('2024-12-31'),
        createdAt: new Date('2024-01-01'),
    } as DeliverySchema;

    const mockDelivery = Delivery.reconstitute({
        id: '123e4567-e89b-12d3-a456-426614174001',
        transactionId: 'TRX-123456',
        address: 'Calle 123 #45-67',
        city: 'Bogotá',
        state: 'Cundinamarca',
        zipCode: '110111',
        country: 'Colombia',
        notes: 'Delivery notes',
        status: DeliveryStatus.PENDING,
        estimatedDelivery: new Date('2024-12-31'),
        createdAt: new Date('2024-01-01'),
    });

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TypeOrmDeliveryRepository,
                {
                    provide: getRepositoryToken(DeliverySchema),
                    useValue: {
                        findOne: jest.fn(),
                        save: jest.fn(),
                        update: jest.fn(),
                        find: jest.fn(),
                    },
                },
            ],
        }).compile();

        repository = module.get<TypeOrmDeliveryRepository>(TypeOrmDeliveryRepository);
        typeormRepo = module.get<Repository<DeliverySchema>>(
            getRepositoryToken(DeliverySchema),
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(repository).toBeDefined();
    });

    describe('findById', () => {
        it('should find and return a delivery by id', async () => {
            jest.spyOn(typeormRepo, 'findOne').mockResolvedValue(mockDeliverySchema);

            const result = await repository.findById('123e4567-e89b-12d3-a456-426614174001');

            expect(result).toBeDefined();
            expect(result?.id).toBe('123e4567-e89b-12d3-a456-426614174001');
            expect(result?.address).toBe('Calle 123 #45-67');
            expect(result?.city).toBe('Bogotá');
            expect(typeormRepo.findOne).toHaveBeenCalledWith({
                where: { id: '123e4567-e89b-12d3-a456-426614174001' },
            });
        });

        it('should return null when delivery is not found by id', async () => {
            jest.spyOn(typeormRepo, 'findOne').mockResolvedValue(null);

            const result = await repository.findById('non-existent-id');

            expect(result).toBeNull();
            expect(typeormRepo.findOne).toHaveBeenCalledWith({
                where: { id: 'non-existent-id' },
            });
        });
    });

    describe('findByTransactionId', () => {
        it('should find and return a delivery by transaction id', async () => {
            jest.spyOn(typeormRepo, 'findOne').mockResolvedValue(mockDeliverySchema);

            const result = await repository.findByTransactionId('TRX-123456');

            expect(result).toBeDefined();
            expect(result?.transactionId).toBe('TRX-123456');
            expect(result?.address).toBe('Calle 123 #45-67');
            expect(typeormRepo.findOne).toHaveBeenCalledWith({
                where: { transactionId: 'TRX-123456' },
            });
        });

        it('should return null when delivery is not found by transaction id', async () => {
            jest.spyOn(typeormRepo, 'findOne').mockResolvedValue(null);

            const result = await repository.findByTransactionId('TRX-999999');

            expect(result).toBeNull();
            expect(typeormRepo.findOne).toHaveBeenCalledWith({
                where: { transactionId: 'TRX-999999' },
            });
        });
    });

    describe('save', () => {
        it('should save a new delivery and return domain entity', async () => {
            jest.spyOn(typeormRepo, 'save').mockResolvedValue(mockDeliverySchema);

            const result = await repository.save(mockDelivery);

            expect(result).toBeDefined();
            expect(result.id).toBe('123e4567-e89b-12d3-a456-426614174001');
            expect(result.transactionId).toBe('TRX-123456');
            expect(result.status).toBe(DeliveryStatus.PENDING);
            expect(typeormRepo.save).toHaveBeenCalled();
        });

        it('should handle save with all delivery properties', async () => {
            jest.spyOn(typeormRepo, 'save').mockResolvedValue(mockDeliverySchema);

            const result = await repository.save(mockDelivery);

            expect(result.address).toBe('Calle 123 #45-67');
            expect(result.city).toBe('Bogotá');
            expect(result.state).toBe('Cundinamarca');
            expect(result.zipCode).toBe('110111');
            expect(result.country).toBe('Colombia');
            expect(typeormRepo.save).toHaveBeenCalledWith(
                expect.objectContaining({
                    transactionId: 'TRX-123456',
                    address: 'Calle 123 #45-67',
                    city: 'Bogotá',
                }),
            );
        });
    });

    describe('update', () => {
        it('should update an existing delivery', async () => {
            jest.spyOn(typeormRepo, 'update').mockResolvedValue({} as any);

            const result = await repository.update(mockDelivery);

            expect(result).toBeDefined();
            expect(result.id).toBe(mockDelivery.id);
            expect(typeormRepo.update).toHaveBeenCalledWith(
                mockDelivery.id,
                expect.objectContaining({
                    transactionId: mockDelivery.transactionId,
                    status: mockDelivery.status,
                }),
            );
        });

        it('should return the same delivery entity after update', async () => {
            jest.spyOn(typeormRepo, 'update').mockResolvedValue({} as any);

            const result = await repository.update(mockDelivery);

            expect(result).toBe(mockDelivery);
        });
    });
});