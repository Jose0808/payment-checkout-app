import { AppConfigService } from '../app-config.service';
import { ConfigService } from '@nestjs/config';

describe('AppConfigService', () => {
    const mockConfig = {
        get: jest.fn(),
        getOrThrow: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return values from config using getters', () => {
        mockConfig.getOrThrow.mockImplementation((key: string) => {
            const data: Record<string, any> = {
                PAYMENT_API_URL: 'https://api.test',
                PAYMENT_PUBLIC_KEY: 'pub',
                PAYMENT_PRIVATE_KEY: 'priv',
                PAYMENT_INTEGRITY_KEY: 'int',
                DB_HOST: 'localhost',
                DB_PORT: 5432,
                DB_USERNAME: 'user',
                DB_PASSWORD: 'pass',
                DB_DATABASE: 'db',
                NODE_ENV: 'test',
            };
            return data[key];
        });

        const service = new AppConfigService(mockConfig as unknown as ConfigService);

        expect(service.apiUrl).toBe('https://api.test');
        expect(service.publicKey).toBe('pub');
        expect(service.privateKey).toBe('priv');
        expect(service.integrityKey).toBe('int');
        expect(service.dataBaseHost).toBe('localhost');
        expect(service.dataBasePort).toBe(5432);
        expect(service.nodeEnv).toBe('test');
    });

    it('should throw if variable missing in getOrThrow', () => {
        mockConfig.get.mockReturnValue(undefined);
        const service = new AppConfigService(mockConfig as unknown as ConfigService);
        expect(() => (service as any).getOrThrow('MISSING')).toThrow(
            '❌ Missing environment variable: MISSING',
        );
    });

    it('should parse port to number', () => {
        mockConfig.get.mockImplementation((key) => (key === 'PORT' ? '3000' : ''));
        const service = new AppConfigService(mockConfig as unknown as ConfigService);
        expect(service.port).toBe(3000);
    });

    it('should return apiPrefix and corsOrigin', () => {
        mockConfig.get.mockImplementation((key) => {
            if (key === 'API_PREFIX') return '/api/v1';
            if (key === 'CORS_ORIGIN') return '*';
            return null;
        });

        const service = new AppConfigService(mockConfig as unknown as ConfigService);
        expect(service.apiPrefix).toBe('/api/v1');
        expect(service.corsOrigin).toBe('*');
    });
});
