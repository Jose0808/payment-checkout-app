import configuration from '../configuration';

describe('configuration', () => {
    const OLD_ENV = process.env;

    beforeEach(() => {
        jest.resetModules();
        process.env = { ...OLD_ENV };
    });

    afterAll(() => {
        process.env = OLD_ENV;
    });

    it('should return default values when env vars are not set', () => {
        delete process.env.PORT;
        delete process.env.DB_HOST;

        const config = configuration();

        expect(config.port).toBe(3000);
        expect(config.apiPrefix).toBe('api/v1');
        expect(config.nodeEnv).toBe('test');
        expect(config.database.host).toBe('localhost');
        expect(config.fees.baseFee).toBe(1000);
    });

    it('should use environment variables when set', () => {
        process.env.PORT = '8080';
        process.env.DB_HOST = 'db.local';
        process.env.BASE_FEE = '2000';
        process.env.CORS_ORIGIN = 'https://example.com';

        const config = configuration();

        expect(config.port).toBe(8080);
        expect(config.database.host).toBe('db.local');
        expect(config.fees.baseFee).toBe(2000);
        expect(config.cors.origin).toBe('https://example.com');
    });
});
