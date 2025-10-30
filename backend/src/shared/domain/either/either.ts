/**
 * Railway Oriented Programming (ROP) Implementation
 * Either type for error handling without exceptions
 */

export type Either<L, R> = Left<L> | Right<R>;

export class Left<L> {
  readonly value: L;
  readonly isLeft = true;
  readonly isRight = false;

  constructor(value: L) {
    this.value = value;
  }

  map<R2>(_fn: (r: never) => R2): Either<L, R2> {
    return this as any;
  }

  flatMap<R2>(_fn: (r: never) => Either<L, R2>): Either<L, R2> {
    return this as any;
  }

  mapLeft<L2>(fn: (l: L) => L2): Either<L2, never> {
    return new Left(fn(this.value));
  }

  fold<T>(leftFn: (l: L) => T, _rightFn: (r: never) => T): T {
    return leftFn(this.value);
  }

  getOrElse<R>(_defaultValue: R): R {
    return _defaultValue;
  }

  orElse<L2, R>(fn: (l: L) => Either<L2, R>): Either<L2, R> {
    return fn(this.value);
  }
}

export class Right<R> {
  readonly value: R;
  readonly isLeft = false;
  readonly isRight = true;

  constructor(value: R) {
    this.value = value;
  }

  map<R2>(fn: (r: R) => R2): Either<never, R2> {
    return new Right(fn(this.value));
  }

  flatMap<L2, R2>(fn: (r: R) => Either<L2, R2>): Either<L2, R2> {
    return fn(this.value);
  }

  mapLeft<L2>(_fn: (l: never) => L2): Either<L2, R> {
    return this as any;
  }

  fold<T>(_leftFn: (l: never) => T, rightFn: (r: R) => T): T {
    return rightFn(this.value);
  }

  getOrElse(_defaultValue: R): R {
    return this.value;
  }

  orElse(_fn: (l: never) => Either<any, R>): Either<never, R> {
    return this;
  }
}

// Factory functions
export const left = <L, R = never>(value: L): Either<L, R> => new Left(value);
export const right = <R, L = never>(value: R): Either<L, R> => new Right(value);

// Helper to work with async operations
export const tryCatch = async <L, R>(
  fn: () => Promise<R>,
  onError: (error: unknown) => L,
): Promise<Either<L, R>> => {
  try {
    const result = await fn();
    return right(result);
  } catch (error) {
    return left(onError(error));
  }
};
