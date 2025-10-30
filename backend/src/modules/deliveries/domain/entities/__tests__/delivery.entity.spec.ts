import { Delivery, DeliveryStatus } from '../delivery.entity';

describe('Delivery Entity', () => {
  const validDeliveryData = {
    transactionId: 'txn-123',
    address: 'Calle 123 #45-67',
    city: 'Bogotá',
    state: 'Cundinamarca',
    zipCode: '110111',
    country: 'Colombia',
    estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
  };

  describe('create', () => {
    it('should create a valid delivery', () => {
      const result = Delivery.create(validDeliveryData);

      expect(result.isSuccess).toBe(true);
      expect(result.value.status).toBe(DeliveryStatus.PENDING);
      expect(result.value.address).toBe('Calle 123 #45-67');
    });

    it('should fail with short address', () => {
      const result = Delivery.create({
        ...validDeliveryData,
        address: 'Abc',
      });

      expect(result.isFailure).toBe(true);
      expect(result.error.code).toBe('VALIDATION_ERROR');
    });

    it('should include optional notes', () => {
      const result = Delivery.create({
        ...validDeliveryData,
        notes: 'Please call before delivery',
      });

      expect(result.isSuccess).toBe(true);
      expect(result.value.notes).toBe('Please call before delivery');
    });
  });

  describe('status transitions', () => {
    it('should transition from PENDING to IN_TRANSIT', () => {
      const deliveryResult = Delivery.create(validDeliveryData);
      const delivery = deliveryResult.value;

      const result = delivery.markAsInTransit();

      expect(result.isSuccess).toBe(true);
      expect(delivery.status).toBe(DeliveryStatus.IN_TRANSIT);
    });

    it('should transition from IN_TRANSIT to DELIVERED', () => {
      const deliveryResult = Delivery.create(validDeliveryData);
      const delivery = deliveryResult.value;

      delivery.markAsInTransit();
      const result = delivery.markAsDelivered();

      expect(result.isSuccess).toBe(true);
      expect(delivery.status).toBe(DeliveryStatus.DELIVERED);
    });

    it('should fail to deliver from PENDING', () => {
      const deliveryResult = Delivery.create(validDeliveryData);
      const delivery = deliveryResult.value;

      const result = delivery.markAsDelivered();

      expect(result.isFailure).toBe(true);
      expect(result.error.code).toBe('VALIDATION_ERROR');
    });

    it('should mark as failed from any status', () => {
      const deliveryResult = Delivery.create(validDeliveryData);
      const delivery = deliveryResult.value;

      const result = delivery.markAsFailed();

      expect(result.isSuccess).toBe(true);
      expect(delivery.status).toBe(DeliveryStatus.FAILED);
    });
  });
});
