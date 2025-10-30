/**
 * Result type for use cases
 * Combines Either with domain errors
 */

export interface DomainError {
  message: string;
  code: string;
  statusCode?: number;
}

export class Result<T> {
  private constructor(
    private readonly _value?: T,
    private readonly _error?: DomainError,
  ) {}

  get value(): T {
    if (this._error) {
      throw new Error('Cannot get value from failed result');
    }
    return this._value!;
  }

  get error(): DomainError {
    if (!this._error) {
      throw new Error('Cannot get error from successful result');
    }
    return this._error;
  }

  get isSuccess(): boolean {
    return !this._error;
  }

  get isFailure(): boolean {
    return !!this._error;
  }

  static ok<U>(value?: U): Result<U> {
    return new Result<U>(value);
  }

  static fail<U>(error: DomainError): Result<U> {
    return new Result<U>(undefined, error);
  }

  static combine(results: Result<any>[]): Result<any> {
    for (const result of results) {
      if (result.isFailure) {
        return result;
      }
    }
    return Result.ok();
  }

  map<U>(fn: (value: T) => U): Result<U> {
    if (this.isFailure) {
      return Result.fail(this._error!);
    }
    try {
      return Result.ok(fn(this._value!));
    } catch (error) {
      return Result.fail({
        message: error instanceof Error ? error.message : 'Unknown error',
        code: 'MAPPING_ERROR',
      });
    }
  }

  flatMap<U>(fn: (value: T) => Result<U>): Result<U> {
    if (this.isFailure) {
      return Result.fail(this._error!);
    }
    return fn(this._value!);
  }

  async flatMapAsync<U>(
    fn: (value: T) => Promise<Result<U>>,
  ): Promise<Result<U>> {
    if (this.isFailure) {
      return Result.fail(this._error!);
    }
    return fn(this._value!);
  }

  onSuccess(fn: (value: T) => void): Result<T> {
    if (this.isSuccess) {
      fn(this._value!);
    }
    return this;
  }

  onFailure(fn: (error: DomainError) => void): Result<T> {
    if (this.isFailure) {
      fn(this._error!);
    }
    return this;
  }
}

// Common domain errors
export class DomainErrors {
  static notFound(entity: string, id?: string): DomainError {
    return {
      message: `${entity}${id ? ` with id ${id}` : ''} not found`,
      code: 'NOT_FOUND',
      statusCode: 404,
    };
  }

  static validation(message: string): DomainError {
    return {
      message,
      code: 'VALIDATION_ERROR',
      statusCode: 400,
    };
  }

  static conflict(message: string): DomainError {
    return {
      message,
      code: 'CONFLICT',
      statusCode: 409,
    };
  }

  static internal(message: string): DomainError {
    return {
      message,
      code: 'INTERNAL_ERROR',
      statusCode: 500,
    };
  }

  static unauthorized(message = 'Unauthorized'): DomainError {
    return {
      message,
      code: 'UNAUTHORIZED',
      statusCode: 401,
    };
  }

  static insufficientStock(available: number): DomainError {
    return {
      message: `Insufficient stock. Available: ${available}`,
      code: 'INSUFFICIENT_STOCK',
      statusCode: 409,
    };
  }

  static paymentFailed(reason: string): DomainError {
    return {
      message: `Payment failed: ${reason}`,
      code: 'PAYMENT_FAILED',
      statusCode: 402,
    };
  }
}
