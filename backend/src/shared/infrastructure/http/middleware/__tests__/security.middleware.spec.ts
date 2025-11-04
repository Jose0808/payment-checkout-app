import { SecurityMiddleware } from '../security.middleware';
import { Request, Response, NextFunction } from 'express';

describe('SecurityMiddleware', () => {
    let middleware: SecurityMiddleware;
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        middleware = new SecurityMiddleware();
        mockReq = { headers: {} };
        mockRes = {
            setHeader: jest.fn(),
            removeHeader: jest.fn(),
        };
        next = jest.fn();
    });

    it('should set all security headers', () => {
        middleware.use(mockReq as Request, mockRes as Response, next);

        expect(mockRes.setHeader).toHaveBeenCalledWith('X-Frame-Options', 'DENY');
        expect(mockRes.setHeader).toHaveBeenCalledWith('X-Content-Type-Options', 'nosniff');
        expect(mockRes.setHeader).toHaveBeenCalledWith('X-XSS-Protection', '1; mode=block');
        expect(mockRes.setHeader).toHaveBeenCalledWith('Referrer-Policy', 'strict-origin-when-cross-origin');
        expect(mockRes.setHeader).toHaveBeenCalledWith(
            'Content-Security-Policy',
            expect.stringContaining("default-src 'self'"),
        );
        expect(mockRes.setHeader).toHaveBeenCalledWith(
            'Permissions-Policy',
            expect.stringContaining('geolocation=()'),
        );
        expect(mockRes.removeHeader).toHaveBeenCalledWith('X-Powered-By');
        expect(next).toHaveBeenCalled();
    });

    it('should set HSTS header when secure connection', () => {
        Object.defineProperty(mockReq, 'secure', { value: true });

        middleware.use(mockReq as Request, mockRes as Response, next);

        expect(mockRes.setHeader).toHaveBeenCalledWith(
            'Strict-Transport-Security',
            expect.stringContaining('max-age'),
        );
    });

    it('should set HSTS header when x-forwarded-proto is https', () => {
        mockReq.headers = { 'x-forwarded-proto': 'https' };

        middleware.use(mockReq as Request, mockRes as Response, next);

        expect(mockRes.setHeader).toHaveBeenCalledWith(
            'Strict-Transport-Security',
            expect.stringContaining('includeSubDomains'),
        );
    });
});
