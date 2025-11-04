import { describe, it, expect } from 'vitest'
import checkoutReducer, {
    openPaymentModal,
    closePaymentModal,
    setCustomerInfo,
    resetCheckout,
    CheckoutStep,
} from '../checkoutSlice'
import { Customer } from '@shared/types'

describe('checkoutSlice', () => {
    it('should return initial state', () => {
        expect(checkoutReducer(undefined, { type: 'unknown' })).toEqual({
            currentStep: CheckoutStep.PRODUCT,
            customer: null,
            cardInfo: null,
            deliveryInfo: null,
            isModalOpen: false,
            isSummaryOpen: false,
        })
    })

    it('should handle openPaymentModal', () => {
        const actual = checkoutReducer(undefined, openPaymentModal())
        expect(actual.isModalOpen).toBe(true)
        expect(actual.currentStep).toBe(CheckoutStep.PAYMENT_INFO)
    })

    it('should handle closePaymentModal', () => {
        const initialState = {
            currentStep: CheckoutStep.PAYMENT_INFO,
            customer: null,
            cardInfo: null,
            deliveryInfo: null,
            isModalOpen: true,
            isSummaryOpen: false,
        }
        const actual = checkoutReducer(initialState, closePaymentModal())
        expect(actual.isModalOpen).toBe(false)
    })

    it('should handle setCustomerInfo', () => {
        const customer: Customer = {
            email: 'test@example.com',
            fullName: 'John Doe',
            phone: '+573001234567',
        }
        const actual = checkoutReducer(undefined, setCustomerInfo(customer))
        expect(actual.customer).toEqual(customer)
    })

    it('should handle resetCheckout', () => {
        const dirtyState = {
            currentStep: CheckoutStep.RESULT,
            customer: { email: 'test@test.com', fullName: 'Test', phone: '123' },
            cardInfo: null,
            deliveryInfo: null,
            isModalOpen: true,
            isSummaryOpen: true,
        }
        const actual = checkoutReducer(dirtyState, resetCheckout())
        expect(actual).toEqual({
            currentStep: CheckoutStep.PRODUCT,
            customer: null,
            cardInfo: null,
            deliveryInfo: null,
            isModalOpen: false,
            isSummaryOpen: false,
        })
    })
})