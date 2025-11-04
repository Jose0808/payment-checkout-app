import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmCustomerRepository } from '../repositories/typeorm-customer.repository';
import { CustomerSchema } from '../persistence/customer.schema';
import { Customer } from '../../domain/entities/customer.entity';

describe('TypeOrmCustomerRepository', () => {
    let repository: TypeOrmCustomerRepository;
    let typeormRepo: Repository<CustomerSchema>;

    const mockCustomerSchema: CustomerSchema = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'john.doe@example.com',
        fullName: 'John Doe',
        phone: '+573001234567',
        createdAt: new Date('2024-01-01'),
    } as CustomerSchema;

    const mockCustomer = Customer.reconstitute({
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'john.doe@example.com',
        fullName: 'John Doe',
        phone: '+573001234567',
        createdAt: new Date('2024-01-01'),
    });

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TypeOrmCustomerRepository,
                {
                    provide: getRepositoryToken(CustomerSchema),
                    useValue: {
                        findOne: jest.fn(),
                        save: jest.fn(),
                        update: jest.fn(),
                        find: jest.fn(),
                    },
                },
            ],
        }).compile();

        repository = module.get<TypeOrmCustomerRepository>(TypeOrmCustomerRepository);
        typeormRepo = module.get<Repository<CustomerSchema>>(
            getRepositoryToken(CustomerSchema),
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(repository).toBeDefined();
    });

    describe('findById', () => {
        it('should find and return a customer by id', async () => {
            jest.spyOn(typeormRepo, 'findOne').mockResolvedValue(mockCustomerSchema);

            const result = await repository.findById('123e4567-e89b-12d3-a456-426614174000');

            expect(result).toBeDefined();
            expect(result?.id).toBe('123e4567-e89b-12d3-a456-426614174000');
            expect(result?.email).toBe('john.doe@example.com');
            expect(result?.fullName).toBe('John Doe');
            expect(typeormRepo.findOne).toHaveBeenCalledWith({
                where: { id: '123e4567-e89b-12d3-a456-426614174000' },
            });
        });

        it('should return null when customer is not found by id', async () => {
            jest.spyOn(typeormRepo, 'findOne').mockResolvedValue(null);

            const result = await repository.findById('non-existent-id');

            expect(result).toBeNull();
            expect(typeormRepo.findOne).toHaveBeenCalledWith({
                where: { id: 'non-existent-id' },
            });
        });
    });

    describe('findByEmail', () => {
        it('should find and return a customer by email', async () => {
            jest.spyOn(typeormRepo, 'findOne').mockResolvedValue(mockCustomerSchema);

            const result = await repository.findByEmail('john.doe@example.com');

            expect(result).toBeDefined();
            expect(result?.email).toBe('john.doe@example.com');
            expect(result?.fullName).toBe('John Doe');
            expect(typeormRepo.findOne).toHaveBeenCalledWith({
                where: { email: 'john.doe@example.com' },
            });
        });

        it('should return null when customer is not found by email', async () => {
            jest.spyOn(typeormRepo, 'findOne').mockResolvedValue(null);

            const result = await repository.findByEmail('notfound@example.com');

            expect(result).toBeNull();
            expect(typeormRepo.findOne).toHaveBeenCalledWith({
                where: { email: 'notfound@example.com' },
            });
        });
    });

    describe('save', () => {
        it('should save a new customer and return domain entity', async () => {
            jest.spyOn(typeormRepo, 'save').mockResolvedValue(mockCustomerSchema);

            const result = await repository.save(mockCustomer);

            expect(result).toBeDefined();
            expect(result.id).toBe('123e4567-e89b-12d3-a456-426614174000');
            expect(result.email).toBe('john.doe@example.com');
            expect(typeormRepo.save).toHaveBeenCalled();
        });

        it('should handle save with all customer properties', async () => {
            const newCustomerSchema = { ...mockCustomerSchema };
            jest.spyOn(typeormRepo, 'save').mockResolvedValue(newCustomerSchema);

            const result = await repository.save(mockCustomer);

            expect(result.fullName).toBe('John Doe');
            expect(result.phone).toBe('+573001234567');
            expect(typeormRepo.save).toHaveBeenCalledWith(
                expect.objectContaining({
                    email: 'john.doe@example.com',
                    fullName: 'John Doe',
                    phone: '+573001234567',
                }),
            );
        });
    });

    describe('update', () => {
        it('should update an existing customer', async () => {
            jest.spyOn(typeormRepo, 'update').mockResolvedValue({} as any);

            const result = await repository.update(mockCustomer);

            expect(result).toBeDefined();
            expect(result.id).toBe(mockCustomer.id);
            expect(typeormRepo.update).toHaveBeenCalledWith(
                mockCustomer.id,
                expect.objectContaining({
                    email: mockCustomer.email,
                    fullName: mockCustomer.fullName,
                }),
            );
        });

        it('should return the same customer entity after update', async () => {
            jest.spyOn(typeormRepo, 'update').mockResolvedValue({} as any);

            const result = await repository.update(mockCustomer);

            expect(result).toBe(mockCustomer);
        });
    });
});