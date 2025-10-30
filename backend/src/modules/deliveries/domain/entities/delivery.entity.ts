import { Result, DomainErrors } from '@shared/domain/result/result';

export enum DeliveryStatus {
  PENDING = 'PENDING',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
}

export interface DeliveryProps {
  id: string;
  transactionId: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  notes?: string;
  status: DeliveryStatus;
  estimatedDelivery: Date;
  createdAt: Date;
}

export class Delivery {
  private constructor(private props: DeliveryProps) {}

  static create(
    props: Omit<DeliveryProps, 'id' | 'status' | 'createdAt'>,
  ): Result<Delivery> {
    const validation = this.validate(props);
    if (validation.isFailure) {
      return Result.fail<Delivery>(validation.error);
    }

    return Result.ok(
      new Delivery({
        ...props,
        id: crypto.randomUUID(),
        status: DeliveryStatus.PENDING,
        createdAt: new Date(),
      }),
    );
  }

  static reconstitute(props: DeliveryProps): Delivery {
    return new Delivery(props);
  }

  private static validate(props: Partial<DeliveryProps>): Result<void> {
    if (!props.transactionId) {
      return Result.fail(DomainErrors.validation('Transaction ID is required'));
    }

    if (!props.address || props.address.trim().length < 5) {
      return Result.fail(
        DomainErrors.validation('Address must be at least 5 characters'),
      );
    }

    if (!props.city || props.city.trim().length < 2) {
      return Result.fail(DomainErrors.validation('City is required'));
    }

    if (!props.state || props.state.trim().length < 2) {
      return Result.fail(DomainErrors.validation('State is required'));
    }

    if (!props.zipCode || props.zipCode.trim().length < 3) {
      return Result.fail(DomainErrors.validation('Zip code is required'));
    }

    if (!props.country || props.country.trim().length < 2) {
      return Result.fail(DomainErrors.validation('Country is required'));
    }

    return Result.ok();
  }

  markAsInTransit(): Result<void> {
    if (this.props.status !== DeliveryStatus.PENDING) {
      return Result.fail(
        DomainErrors.validation(
          'Only pending deliveries can be marked as in transit',
        ),
      );
    }
    this.props.status = DeliveryStatus.IN_TRANSIT;
    return Result.ok();
  }

  markAsDelivered(): Result<void> {
    if (this.props.status !== DeliveryStatus.IN_TRANSIT) {
      return Result.fail(
        DomainErrors.validation(
          'Only in-transit deliveries can be marked as delivered',
        ),
      );
    }
    this.props.status = DeliveryStatus.DELIVERED;
    return Result.ok();
  }

  markAsFailed(): Result<void> {
    this.props.status = DeliveryStatus.FAILED;
    return Result.ok();
  }

  get id(): string {
    return this.props.id;
  }
  get transactionId(): string {
    return this.props.transactionId;
  }
  get address(): string {
    return this.props.address;
  }
  get city(): string {
    return this.props.city;
  }
  get state(): string {
    return this.props.state;
  }
  get zipCode(): string {
    return this.props.zipCode;
  }
  get country(): string {
    return this.props.country;
  }
  get notes(): string | undefined {
    return this.props.notes;
  }
  get status(): DeliveryStatus {
    return this.props.status;
  }
  get estimatedDelivery(): Date {
    return this.props.estimatedDelivery;
  }
  get createdAt(): Date {
    return this.props.createdAt;
  }

  toJSON() {
    return {
      id: this.id,
      transactionId: this.transactionId,
      address: this.address,
      city: this.city,
      state: this.state,
      zipCode: this.zipCode,
      country: this.country,
      notes: this.notes,
      status: this.status,
      estimatedDelivery: this.estimatedDelivery,
      createdAt: this.createdAt,
    };
  }
}
