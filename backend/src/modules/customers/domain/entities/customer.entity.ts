import { Result, DomainErrors } from '@shared/domain/result/result';

export interface CustomerProps {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  createdAt: Date;
}

export class Customer {
  private constructor(private props: CustomerProps) {}

  static create(
    props: Omit<CustomerProps, 'id' | 'createdAt'>,
  ): Result<Customer> {
    const validation = this.validate(props);
    if (validation.isFailure) {
      return Result.fail<Customer>(validation.error);
    }

    return Result.ok(
      new Customer({
        ...props,
        id: crypto.randomUUID(),
        createdAt: new Date(),
      }),
    );
  }

  static reconstitute(props: CustomerProps): Customer {
    return new Customer(props);
  }

  private static validate(props: Partial<CustomerProps>): Result<void> {
    if (!props.email || !this.isValidEmail(props.email)) {
      return Result.fail(DomainErrors.validation('Invalid email format'));
    }

    if (!props.fullName || props.fullName.trim().length < 3) {
      return Result.fail(
        DomainErrors.validation('Full name must be at least 3 characters'),
      );
    }

    if (!props.phone || !this.isValidPhone(props.phone)) {
      return Result.fail(DomainErrors.validation('Invalid phone format'));
    }

    return Result.ok();
  }

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private static isValidPhone(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s-()]{10,}$/;
    return phoneRegex.test(phone);
  }

  get id(): string {
    return this.props.id;
  }
  get email(): string {
    return this.props.email;
  }
  get fullName(): string {
    return this.props.fullName;
  }
  get phone(): string {
    return this.props.phone;
  }
  get createdAt(): Date {
    return this.props.createdAt;
  }

  toJSON() {
    return {
      id: this.id,
      email: this.email,
      fullName: this.fullName,
      phone: this.phone,
      createdAt: this.createdAt,
    };
  }
}
