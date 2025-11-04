import { Result, DomainErrors, DomainError } from '../result/result';

describe('Result', () => {
    it('should create a success result and retrieve value', () => {
        const res = Result.ok('success');
        expect(res.isSuccess).toBe(true);
        expect(res.isFailure).toBe(false);
        expect(res.value).toBe('success');
    });

    it('should throw when accessing value of failed result', () => {
        const err: DomainError = { message: 'error', code: 'ERR' };
        const res = Result.fail<string>(err);
        expect(res.isSuccess).toBe(false);
        expect(res.isFailure).toBe(true);
        expect(() => res.value).toThrow('Cannot get value from failed result');
    });

    it('should throw when accessing error of success result', () => {
        const res = Result.ok('data');
        expect(() => res.error).toThrow('Cannot get error from successful result');
    });

    it('should combine results and return first failure', () => {
        const results = [
            Result.ok('a'),
            Result.fail({ message: 'fail', code: 'F' }),
            Result.ok('b'),
        ];
        const combined = Result.combine(results);
        expect(combined.isFailure).toBe(true);
        expect(combined.error.message).toBe('fail');
    });

    it('should combine results and succeed if all succeed', () => {
        const results = [Result.ok('a'), Result.ok('b')];
        const combined = Result.combine(results);
        expect(combined.isSuccess).toBe(true);
    });

    it('should map a successful result', () => {
        const result = Result.ok(2);
        const mapped = result.map((v) => v * 2);
        expect(mapped.value).toBe(4);
    });

    it('should map a failed result and keep error', () => {
        const error = { message: 'fail', code: 'FAIL' };
        const result = Result.fail<number>(error);
        const mapped = result.map((v) => v * 2);
        expect(mapped.isFailure).toBe(true);
        expect(mapped.error).toEqual(error);
    });

    it('should return fail when map throws', () => {
        const result = Result.ok('text');
        const mapped = result.map(() => {
            throw new Error('bad map');
        });
        expect(mapped.isFailure).toBe(true);
        expect(mapped.error.code).toBe('MAPPING_ERROR');
    });

    it('should flatMap successful result', () => {
        const res = Result.ok(2);
        const flat = res.flatMap((v) => Result.ok(v * 3));
        expect(flat.value).toBe(6);
    });

    it('should flatMap failed result and propagate error', () => {
        const error = { message: 'no', code: 'ERR' };
        const res = Result.fail<number>(error);
        const flat = res.flatMap(() => Result.ok(1));
        expect(flat.isFailure).toBe(true);
        expect(flat.error).toEqual(error);
    });

    it('should flatMapAsync successful result', async () => {
        const res = Result.ok(2);
        const flat = await res.flatMapAsync(async (v) => Result.ok(v + 5));
        expect(flat.value).toBe(7);
    });

    it('should flatMapAsync failed result and propagate error', async () => {
        const error = { message: 'fail', code: 'ERR' };
        const res = Result.fail<number>(error);
        const flat = await res.flatMapAsync(async () => Result.ok(99));
        expect(flat.isFailure).toBe(true);
        expect(flat.error).toEqual(error);
    });

    it('should call onSuccess when successful', () => {
        const mock = jest.fn();
        Result.ok(10).onSuccess(mock);
        expect(mock).toHaveBeenCalledWith(10);
    });

    it('should call onFailure when failed', () => {
        const mock = jest.fn();
        const err = { message: 'boom', code: 'FAIL' };
        Result.fail<number>(err).onFailure(mock);
        expect(mock).toHaveBeenCalledWith(err);
    });
});

describe('DomainErrors', () => {
    it('should create a notFound error', () => {
        const e = DomainErrors.notFound('User', '123');
        expect(e.code).toBe('NOT_FOUND');
        expect(e.statusCode).toBe(404);
    });

    it('should create a validation error', () => {
        const e = DomainErrors.validation('Bad data');
        expect(e.code).toBe('VALIDATION_ERROR');
        expect(e.statusCode).toBe(400);
    });

    it('should create a conflict error', () => {
        const e = DomainErrors.conflict('Duplicate');
        expect(e.code).toBe('CONFLICT');
    });

    it('should create an internal error', () => {
        const e = DomainErrors.internal('Oops');
        expect(e.code).toBe('INTERNAL_ERROR');
    });

    it('should create unauthorized error', () => {
        const e = DomainErrors.unauthorized();
        expect(e.statusCode).toBe(401);
    });

    it('should create insufficient stock error', () => {
        const e = DomainErrors.insufficientStock(5);
        expect(e.message).toContain('5');
    });

    it('should create payment failed error', () => {
        const e = DomainErrors.paymentFailed('bank issue');
        expect(e.message).toContain('bank issue');
        expect(e.code).toBe('PAYMENT_FAILED');
    });
});
