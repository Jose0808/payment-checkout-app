export interface Product {
    id: string
    name: string
    description: string
    price: number
    stock: number
    imageUrl: string
    createdAt: string
    updatedAt: string
}

export interface Customer {
    email: string
    fullName: string
    phone: string
}

export interface CardInfo {
    cardNumber: string
    cardHolder: string
    expirationDate: string
    cvv: string
}

export interface DeliveryInfo {
    address: string
    city: string
    state: string
    zipCode: string
    country: string
    notes?: string
}

export interface Transaction {
    id: string
    transactionNumber: string
    productId: string
    customerId: string
    productAmount: number
    baseFee: number
    deliveryFee: number
    totalAmount: number
    status: TransactionStatus
    wompiTransactionId?: string
    paymentMethod: string
    createdAt: string
    updatedAt: string
}

export enum TransactionStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    DECLINED = 'DECLINED',
    ERROR = 'ERROR',
}

export enum CardType {
    VISA = 'VISA',
    MASTERCARD = 'MASTERCARD',
    AMEX = 'AMEX',
    DISCOVER = 'DISCOVER',
    UNKNOWN = 'UNKNOWN',
}

export interface ApiError {
    message: string
    code: string
    statusCode: number
}

export interface ApiResponse<T> {
    success: boolean
    data: T
    timestamp: string
}