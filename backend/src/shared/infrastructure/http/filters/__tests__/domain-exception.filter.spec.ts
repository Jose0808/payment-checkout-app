import { DomainExceptionFilter } from '../domain-exception.filter';
import { ArgumentsHost, HttpStatus } from '@nestjs/common';

describe('DomainExceptionFilter', () => {
    let filter: DomainExceptionFilter;
    let mockResponse: any;
    let mockHost: any;

    beforeEach(() => {
        filter = new DomainExceptionFilter();
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        mockHost = {
            switchToHttp: () => ({
                getResponse: () => mockResponse,
            }),
        } as unknown as ArgumentsHost;
    });

    it('should handle a DomainError', () => {
        const domainError = {
            message: 'Not found',
            code: 'NOT_FOUND',
            statusCode: HttpStatus.NOT_FOUND,
        };

        filter.catch(domainError, mockHost);

        expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
        expect(mockResponse.json).toHaveBeenCalledWith(
            expect.objectContaining({
                code: 'NOT_FOUND',
                message: 'Not found',
            }),
        );
    });

    it('should handle generic Error', () => {
        const error = new Error('Unexpected error');
        filter.catch(error, mockHost);

        expect(mockResponse.status).toHaveBeenCalledWith(
            HttpStatus.INTERNAL_SERVER_ERROR,
        );
        expect(mockResponse.json).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'Unexpected error',
            }),
        );
    });

    it('should handle unknown exceptions', () => {
        filter.catch('string error' as any, mockHost);

        expect(mockResponse.status).toHaveBeenCalledWith(
            HttpStatus.INTERNAL_SERVER_ERROR,
        );
        expect(mockResponse.json).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'Internal server error',
                code: 'INTERNAL_ERROR',
            }),
        );
    });
});
