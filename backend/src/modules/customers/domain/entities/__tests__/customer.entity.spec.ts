import { Customer } from '../customer.entity';

describe('Customer Entity', () => {
  const validCustomerData = {
    email: 'test@example.com',
    fullName: 'John Doe',
    phone: '+573001234567',
  };

  describe('create', () => {
    it('should create a valid customer', () => {
      const result = Customer.create(validCustomerData);

      expect(result.isSuccess).toBe(true);
      expect(result.value.email).toBe('test@example.com');
      expect(result.value.fullName).toBe('John Doe');
      expect(result.value.phone).toBe('+573001234567');
    });

    it('should fail with invalid email', () => {
      const result = Customer.create({
        ...validCustomerData,
        email: 'invalid-email',
      });

      expect(result.isFailure).toBe(true);
      expect(result.error.code).toBe('VALIDATION_ERROR');
      expect(result.error.message).toContain('email');
    });

    it('should fail with short name', () => {
      const result = Customer.create({
        ...validCustomerData,
        fullName: 'Jo',
      });

      expect(result.isFailure).toBe(true);
      expect(result.error.code).toBe('VALIDATION_ERROR');
      expect(result.error.message).toContain('name');
    });

    it('should fail with invalid phone', () => {
      const result = Customer.create({
        ...validCustomerData,
        phone: '123',
      });

      expect(result.isFailure).toBe(true);
      expect(result.error.code).toBe('VALIDATION_ERROR');
      expect(result.error.message).toContain('phone');
    });

    it('should accept various phone formats', () => {
      const phones = [
        '+573001234567',
        '3001234567',
        '(300) 123-4567',
        '+57 300 123 4567',
      ];

      phones.forEach((phone) => {
        const result = Customer.create({
          ...validCustomerData,
          phone,
        });

        expect(result.isSuccess).toBe(true);
      });
    });
  });
});
