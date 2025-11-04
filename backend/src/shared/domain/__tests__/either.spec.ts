import { Left, Right, left, right, tryCatch } from '../either/either';

describe('Either', () => {
    it('should create Left and Right correctly', () => {
        const l = new Left('error');
        const r = new Right(42);
        expect(l.isLeft).toBe(true);
        expect(r.isRight).toBe(true);
    });

    it('Left.map should not change value', () => {
        const l = new Left('fail');
        const mapped = l.map((v: any) => v + ' changed');
        expect((mapped as Left<string>).value).toBe('fail');
    });

    it('Right.map should transform value', () => {
        const r = new Right(2);
        const mapped = r.map((v) => v * 3);
        expect((mapped as Right<number>).value).toBe(6);
    });

    it('Left.flatMap should ignore mapper', () => {
        const l = new Left('error');
        const res = l.flatMap(() => right(5));
        expect(res).toBeInstanceOf(Left);
    });

    it('Right.flatMap should apply mapper', () => {
        const r = new Right(2);
        const res = r.flatMap((v) => right(v * 5));
        expect((res as Right<number>).value).toBe(10);
    });

    it('Left.mapLeft should transform left value', () => {
        const l = new Left('bad');
        const mapped = l.mapLeft((v) => v + '_changed');
        expect((mapped as Left<string>).value).toBe('bad_changed');
    });

    it('Right.mapLeft should return same Right', () => {
        const r = new Right('ok');
        const mapped = r.mapLeft((v: any) => v + 'x');
        expect(mapped).toBe(r);
    });

    it('Left.fold should execute leftFn', () => {
        const l = new Left('err');
        const result = l.fold((x) => `left:${x}`, (r) => `right:${r}`);
        expect(result).toBe('left:err');
    });

    it('Right.fold should execute rightFn', () => {
        const r = new Right('ok');
        const result = r.fold((x) => `left:${x}`, (r) => `right:${r}`);
        expect(result).toBe('right:ok');
    });

    it('Left.getOrElse should return default value', () => {
        const l = new Left('err');
        expect(l.getOrElse('default')).toBe('default');
    });

    it('Right.getOrElse should return inner value', () => {
        const r = new Right('real');
        expect(r.getOrElse('default')).toBe('real');
    });

    it('Left.orElse should execute fallback', () => {
        const l = new Left('error');
        const r = l.orElse((e) => right(`fixed:${e}`));
        expect((r as Right<string>).value).toContain('fixed:error');
    });

    it('Right.orElse should return same Right', () => {
        const r = new Right('ok');
        const result = r.orElse(() => left('fail'));
        expect(result).toBe(r);
    });
});

describe('tryCatch', () => {
    it('should return Right on success', async () => {
        const fn = jest.fn().mockResolvedValue('ok');
        const result = await tryCatch(fn, () => 'error');
        expect(result.isRight).toBe(true);
        expect((result as Right<string>).value).toBe('ok');
    });

    it('should return Left on failure', async () => {
        const fn = jest.fn().mockRejectedValue(new Error('boom'));
        const result = await tryCatch(fn, (e) => (e as Error).message);
        expect(result.isLeft).toBe(true);
        expect((result as Left<string>).value).toBe('boom');
    });
});
