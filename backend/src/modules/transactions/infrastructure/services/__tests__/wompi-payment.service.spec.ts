import axios from 'axios';
import { Logger } from '@nestjs/common';
import { WompiPaymentService } from '../wompi-payment.service';
import { AppConfigService } from '@shared/infrastructure/config/app-config.service';

// Mock de axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock de AppConfigService
const mockConfig = {
    apiUrl: 'https://sandbox.wompi.co/v1',
    publicKey: 'pub_test_key',
    privateKey: 'prv_test_key',
    integrityKey: 'test_integrity_key',
};

describe('WompiPaymentService', () => {
    let service: WompiPaymentService;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(Logger.prototype, 'log').mockImplementation(() => { });
        jest.spyOn(Logger.prototype, 'error').mockImplementation(() => { });

        service = new WompiPaymentService(mockConfig as any);
        (mockedAxios.create as jest.Mock).mockReturnValue(mockedAxios);
    });

    const request = {
        amount: 1000,
        currency: 'COP',
        customerEmail: 'test@user.com',
        reference: 'REF123',
        cardNumber: '4242424242424242',
        cardHolder: 'John Doe',
        expirationDate: '12/30',
        cvv: '123',
    };

    it('should process payment successfully (APPROVED)', async () => {
        // Mock flujo tokenización
        mockedAxios.post
            .mockResolvedValueOnce({ data: { data: { id: 'token_123' } } }) // tokenizeCard
            .mockResolvedValueOnce({
                data: {
                    data: {
                        id: 'tx_1',
                        status: 'APPROVED',
                        reference: 'REF123',
                    },
                },
            }); // createTransaction

        // Mock acceptance token
        mockedAxios.get.mockResolvedValueOnce({
            data: { data: { presigned_acceptance: { acceptance_token: 'token_acc' } } },
        });

        const result = await service.processPayment(request);

        expect(result.status).toBe('APPROVED');
        expect(result.id).toBe('tx_1');
        expect(mockedAxios.post).toHaveBeenCalledTimes(2);
    });

    it('should return DECLINED when payment declined', async () => {
        mockedAxios.post
            .mockResolvedValueOnce({ data: { data: { id: 'token_123' } } }) // tokenizeCard
            .mockResolvedValueOnce({
                data: {
                    data: {
                        id: 'tx_2',
                        status: 'DECLINED',
                        reference: 'REF999',
                    },
                },
            });
        mockedAxios.get.mockResolvedValueOnce({
            data: { data: { presigned_acceptance: { acceptance_token: 'token_acc' } } },
        });

        const result = await service.processPayment(request);
        expect(result.status).toBe('DECLINED');
    });

    it('should handle AxiosError gracefully', async () => {
        const axiosError = {
            isAxiosError: true,
            response: { data: { error: { message: 'Card expired' } } },
        };
        mockedAxios.post.mockRejectedValue(axiosError);

        const result = await service.processPayment(request);

        expect(result.status).toBe('ERROR');
        expect(result.message).toBe('Card expired');
    });

    it('should handle unexpected error gracefully', async () => {
        mockedAxios.post.mockRejectedValue(new Error('Unexpected failure'));

        const result = await service.processPayment(request);

        expect(result.status).toBe('ERROR');
        expect(result.message).toBe('Unexpected failure');
    });

    it('should throw error when tokenization fails', async () => {
        mockedAxios.post.mockRejectedValueOnce(new Error('Invalid card'));
        await expect(service['tokenizeCard'](request)).rejects.toThrow('Invalid card');
    });

    it('should generate a valid SHA256 integrity signature', () => {
        const signature = service['generateIntegritySignature']('REF123', 100000, 'COP');
        expect(signature).toHaveLength(64);
    });

    it('should get transaction status successfully', async () => {
        mockedAxios.get.mockResolvedValueOnce({
            data: {
                data: {
                    id: 'tx_123',
                    status: 'PENDING',
                    reference: 'REF123',
                },
            },
        });

        const result = await service.getTransactionStatus('tx_123');
        expect(result.status).toBe('PENDING');
        expect(result.reference).toBe('REF123');
    });

    it('should handle error when fetching transaction status', async () => {
        mockedAxios.get.mockRejectedValue(new Error('Network error'));
        await expect(service.getTransactionStatus('tx_error')).rejects.toThrow('Network error');
    });
});
