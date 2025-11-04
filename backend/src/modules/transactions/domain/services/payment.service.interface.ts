export interface PaymentRequest {
  amount: number;
  currency: string;
  customerEmail: string;
  reference: string;
  cardNumber: string;
  cardHolder: string;
  expirationDate: string;
  cvv: string;
}

export interface PaymentResponse {
  id: string;
  status: 'APPROVED' | 'DECLINED' | 'ERROR' | 'PENDING';
  reference: string;
  message?: string;
}

export interface IPaymentService {
  processPayment(request: PaymentRequest): Promise<PaymentResponse>;
  getTransactionStatus(transactionId: string): Promise<PaymentResponse>;
}

export const PAYMENT_SERVICE = Symbol('PAYMENT_SERVICE');
