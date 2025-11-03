import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import * as crypto from 'crypto';
import {
  IPaymentService,
  PaymentRequest,
  PaymentResponse,
} from '../../domain/services/payment.service.interface';
import { AppConfigService } from '@shared/infrastructure/config/app-config.service';
import { log } from 'console';

interface WompiTokenResponse {
  data: { id: string };
}

interface WompiTransactionResponse {
  data: {
    id: string;
    status: string;
    reference: string;
    payment_method_type: string;
    payment_method: { type: string; extra: any };
  };
}

@Injectable()
export class WompiPaymentService implements IPaymentService {
  private readonly logger = new Logger(WompiPaymentService.name);
  private readonly httpClient: AxiosInstance;
  private readonly integrityKey: string;

  constructor(private readonly paymentConfig: AppConfigService) {
    this.httpClient = axios.create({
      baseURL: paymentConfig.apiUrl,
      timeout: 30000,
      headers: { 'Content-Type': 'application/json' },
    });

    this.logger.log('✅ Wompi Payment Service initialized');
  }

  async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      this.logger.log(`Processing payment for reference: ${request.reference}`);

      const token = await this.tokenizeCard(request);

      const transactionResponse = await this.createTransaction(
        token,
        request.amount,
        request.currency,
        request.customerEmail,
        request.reference,
      );

      const status = this.mapWompiStatus(transactionResponse.data.status);

      return {
        id: transactionResponse.data.id,
        status,
        reference: transactionResponse.data.reference,
        message:
          status === 'APPROVED'
            ? 'Payment approved successfully'
            : 'Payment declined',
      };
    } catch (error) {
      this.logger.error('Payment processing error', error);

      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.error?.reason ||
          error.response?.data?.error?.message ||
          'Payment processing failed';

        return {
          id: '',
          status: 'ERROR',
          reference: request.reference,
          message,
        };
      }

      return {
        id: '',
        status: 'ERROR',
        reference: request.reference,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async getTransactionStatus(transactionId: string): Promise<PaymentResponse> {
    try {
      const response = await this.httpClient.get<WompiTransactionResponse>(
        `/transactions/${transactionId}`,
        {
          headers: { Authorization: `Bearer ${this.paymentConfig.privateKey}` },
        },
      );

      const status = this.mapWompiStatus(response.data.data.status);

      return {
        id: response.data.data.id,
        status,
        reference: response.data.data.reference,
      };
    } catch (error) {
      this.logger.error('Error getting transaction status', error);
      throw error;
    }
  }

  private async tokenizeCard(request: PaymentRequest): Promise<string> {
    try {
      const [expMonth, expYear] = request.expirationDate.split('/');
      const fullYear = `20${expYear}`;

      const tokenPayload = {
        number: request.cardNumber,
        cvc: request.cvv,
        exp_month: expMonth,
        exp_year: expYear,
        card_holder: request.cardHolder,
      };

      const response = await this.httpClient.post<WompiTokenResponse>(
        '/tokens/cards',
        tokenPayload,
        {
          headers: { Authorization: `Bearer ${this.paymentConfig.publicKey}` },
        },
      );

      this.logger.log('Card tokenized successfully');
      return response.data.data.id;
    } catch (error) {
      this.logger.error('Card tokenization error', error);
      throw error;
    }
  }

  private async createTransaction(
    token: string,
    amount: number,
    currency: string,
    customerEmail: string,
    reference: string,
  ): Promise<WompiTransactionResponse> {
    const amountInCents = Math.round(amount * 100);
    const integritySignature = this.generateIntegritySignature(
      reference,
      amountInCents,
      currency,
    );

    const transactionPayload = {
      acceptance_token: await this.getAcceptanceToken(),
      amount_in_cents: amountInCents,
      currency,
      customer_email: customerEmail,
      payment_method: {
        type: 'CARD',
        token,
        installments: 1,
      },
      reference,
      signature: integritySignature,
    };

    this.logger.log(JSON.stringify(transactionPayload));

    const response = await this.httpClient.post<WompiTransactionResponse>(
      '/transactions',
      transactionPayload,
      {
        headers: { Authorization: `Bearer ${this.paymentConfig.privateKey}` },
      },
    );

    this.logger.log(
      `Transaction created: ${response.data.data.id} - Status: ${response.data.data.status}`,
    );

    return response.data;
  }

  private async getAcceptanceToken(): Promise<string> {
    try {
      const response = await this.httpClient.get(
        `/merchants/${this.paymentConfig.publicKey}`,
      );
      return response.data.data.presigned_acceptance.acceptance_token;
    } catch (error) {
      this.logger.error('Error getting acceptance token', error);
      return 'sandbox_acceptance_token';
    }
  }

  private generateIntegritySignature(
    reference: string,
    amountInCents: number,
    currency: string,
  ): string {
    const data = `${reference}${amountInCents}${currency}${this.paymentConfig.integrityKey}`;
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  private mapWompiStatus(status: string): 'APPROVED' | 'DECLINED' | 'ERROR' | 'PENDING' {
    const map: Record<string, 'APPROVED' | 'DECLINED' | 'ERROR' | 'PENDING'> = {
      APPROVED: 'APPROVED',
      DECLINED: 'DECLINED',
      VOIDED: 'DECLINED',
      ERROR: 'ERROR',
      PENDING: 'PENDING',
    };
    return map[status] || 'ERROR';
  }
}
