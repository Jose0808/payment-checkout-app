import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { Transaction, Customer, CardInfo, DeliveryInfo } from '@shared/types'
import { paymentAPI } from './paymentAPI'

interface PaymentState {
    currentTransaction: Transaction | null
    processing: boolean
    error: string | null
    fees: {
        baseFee: number
        deliveryFee: number
    }
}

const initialState: PaymentState = {
    currentTransaction: null,
    processing: false,
    error: null,
    fees: {
        baseFee: 1000,
        deliveryFee: 5000,
    },
}

// Async thunks
export const createTransaction = createAsyncThunk(
    'payment/createTransaction',
    async (
        { productId, customer }: { productId: string; customer: Customer },
        { rejectWithValue }
    ) => {
        try {
            return await paymentAPI.createTransaction(productId, customer)
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to create transaction'
            )
        }
    }
)

export const processPayment = createAsyncThunk(
    'payment/processPayment',
    async (
        {
            transactionId,
            card,
            delivery,
        }: { transactionId: string; card: CardInfo; delivery: DeliveryInfo },
        { rejectWithValue }
    ) => {
        try {
            return await paymentAPI.processPayment(transactionId, card, delivery)
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to process payment'
            )
        }
    }
)

const paymentSlice = createSlice({
    name: 'payment',
    initialState,
    reducers: {
        clearPayment: state => {
            state.currentTransaction = null
            state.processing = false
            state.error = null
        },
        setCurrentTransaction: (state, action: PayloadAction<Transaction>) => {
            state.currentTransaction = action.payload
        },
    },
    extraReducers: builder => {
        builder
            // Create transaction
            .addCase(createTransaction.pending, state => {
                state.processing = true
                state.error = null
            })
            .addCase(createTransaction.fulfilled, (state, action) => {
                state.processing = false
                state.currentTransaction = action.payload
            })
            .addCase(createTransaction.rejected, (state, action) => {
                state.processing = false
                state.error = action.payload as string
            })
            // Process payment
            .addCase(processPayment.pending, state => {
                state.processing = true
                state.error = null
            })
            .addCase(processPayment.fulfilled, (state, action) => {
                state.processing = false
                state.currentTransaction = action.payload
            })
            .addCase(processPayment.rejected, (state, action) => {
                state.processing = false
                state.error = action.payload as string
            })
    },
})

export const { clearPayment, setCurrentTransaction } = paymentSlice.actions
export default paymentSlice.reducer
