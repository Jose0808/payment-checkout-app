import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Transaction } from '@shared/types'

interface TransactionState {
    lastTransaction: Transaction | null
    history: Transaction[]
}

const initialState: TransactionState = {
    lastTransaction: null,
    history: [],
}

const transactionSlice = createSlice({
    name: 'transaction',
    initialState,
    reducers: {
        setLastTransaction: (state, action: PayloadAction<Transaction>) => {
            state.lastTransaction = action.payload
            state.history.unshift(action.payload)
            // Keep only last 10 transactions
            if (state.history.length > 10) {
                state.history = state.history.slice(0, 10)
            }
        },
        clearLastTransaction: state => {
            state.lastTransaction = null
        },
        clearHistory: state => {
            state.history = []
        },
    },
})

export const { setLastTransaction, clearLastTransaction, clearHistory } =
    transactionSlice.actions
export default transactionSlice.reducer
