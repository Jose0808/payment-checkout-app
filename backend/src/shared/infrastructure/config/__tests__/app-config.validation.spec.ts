import { validateEnv, EnvironmentVariables } from '../app-config.validation';

describe('validateEnv', () => {
    it('should validate and return the validated config when all required envs exist', () => {
        const config = {
            PAYMENT_API_URL: 'https://api.test',
            PAYMENT_PUBLIC_KEY: 'public123',
            PAYMENT_PRIVATE_KEY: 'private123',
            PAYMENT_INTEGRITY_KEY: 'integrity123',
        };

        const validated = validateEnv(config);

        expect(validated).toBeInstanceOf(EnvironmentVariables);
        expect(validated.PAYMENT_API_URL).toBe(config.PAYMENT_API_URL);
    });

    it('should throw an error when env vars are missing', () => {
        const config = {};

        expect(() => validateEnv(config)).toThrow(/Environment validation error/);
    });
});
