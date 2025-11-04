import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Customer, CardInfo, DeliveryInfo } from '@shared/types'

export enum CheckoutStep {
    PRODUCT = 'PRODUCT',
    PAYMENT_INFO = 'PAYMENT_INFO',
    SUMMARY = 'SUMMARY',
    RESULT = 'RESULT',
}

interface CheckoutState {
    currentStep: CheckoutStep
    customer: Customer | null
    cardInfo: CardInfo | null
    deliveryInfo: DeliveryInfo | null
    isModalOpen: boolean
    isSummaryOpen: boolean
}

const initialState: CheckoutState = {
    currentStep: CheckoutStep.PRODUCT,
    customer: null,
    cardInfo: null,
    deliveryInfo: null,
    isModalOpen: false,
    isSummaryOpen: false,
}

const checkoutSlice = createSlice({
    name: 'checkout',
    initialState,
    reducers: {
        setCurrentStep: (state, action: PayloadAction<CheckoutStep>) => {
            state.currentStep = action.payload
        },
        openPaymentModal: state => {
            state.isModalOpen = true
            state.currentStep = CheckoutStep.PAYMENT_INFO
        },
        closePaymentModal: state => {
            state.isModalOpen = false
        },
        setCustomerInfo: (state, action: PayloadAction<Customer>) => {
            state.customer = action.payload
        },
        setCardInfo: (state, action: PayloadAction<CardInfo>) => {
            state.cardInfo = action.payload
        },
        setDeliveryInfo: (state, action: PayloadAction<DeliveryInfo>) => {
            state.deliveryInfo = action.payload
        },
        openSummary: state => {
            state.isSummaryOpen = true
            state.currentStep = CheckoutStep.SUMMARY
        },
        closeSummary: state => {
            state.isSummaryOpen = false
        },
        resetCheckout: state => {
            state.currentStep = CheckoutStep.PRODUCT
            state.customer = null
            state.cardInfo = null
            state.deliveryInfo = null
            state.isModalOpen = false
            state.isSummaryOpen = false
        },
    },
})

export const {
    setCurrentStep,
    openPaymentModal,
    closePaymentModal,
    setCustomerInfo,
    setCardInfo,
    setDeliveryInfo,
    openSummary,
    closeSummary,
    resetCheckout,
} = checkoutSlice.actions

export default checkoutSlice.reducer