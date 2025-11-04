import apiClient from '@services/api'
import { Transaction, ApiResponse, Customer, CardInfo, DeliveryInfo } from '@shared/types'

export interface CreateTransactionRequest {
    productId: string
    customerEmail: string
    customerFullName: string
    customerPhone: string
    baseFee: number
    deliveryFee: number
    paymentMethod: string
}

export interface ProcessPaymentRequest {
    transactionId: string
    cardNumber: string
    cardHolder: string
    expirationDate: string
    cvv: string
    deliveryAddress: string
    deliveryCity: string
    deliveryState: string
    deliveryZipCode: string
    deliveryCountry: string
    deliveryNotes?: string
}

export const paymentAPI = {
    createTransaction: async (
        productId: string,
        customer: Customer
    ): Promise<Transaction> => {
        const request: CreateTransactionRequest = {
            productId,
            customerEmail: customer.email,
            customerFullName: customer.fullName,
            customerPhone: customer.phone,
            baseFee: 1000, // Base fee from backend
            deliveryFee: 5000, // Delivery fee from backend
            paymentMethod: 'CARD',
        }

        const response = await apiClient.post<ApiResponse<Transaction>>(
            '/transactions',
            request
        )
        return response.data.data
    },

    processPayment: async (
        transactionId: string,
        card: CardInfo,
        delivery: DeliveryInfo
    ): Promise<Transaction> => {
        const request: ProcessPaymentRequest = {
            transactionId,
            cardNumber: card.cardNumber,
            cardHolder: card.cardHolder,
            expirationDate: card.expirationDate,
            cvv: card.cvv,
            deliveryAddress: delivery.address,
            deliveryCity: delivery.city,
            deliveryState: delivery.state,
            deliveryZipCode: delivery.zipCode,
            deliveryCountry: delivery.country,
            deliveryNotes: delivery.notes,
        }

        const response = await apiClient.post<ApiResponse<Transaction>>(
            '/transactions/process-payment',
            request
        )
        return response.data.data
    },
}