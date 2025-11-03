import { describe, it, expect } from 'vitest'
import transactionReducer, {
    setLastTransaction,
    clearLastTransaction,
    clearHistory,
} from '../transactionSlice'
import { Transaction, TransactionStatus } from '@shared/types'

const mockTransaction: Transaction = {
    id: '1',
    transactionNumber: 'TXN-123',
    productId: 'prod-1',
    customerId: 'cust-1',
    productAmount: 100000,
    baseFee: 1000,
    deliveryFee: 5000,
    totalAmount: 106000,
    status: TransactionStatus.APPROVED,
    paymentMethod: 'CARD',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
}

describe('transactionSlice', () => {
    it('should return initial state', () => {
        expect(transactionReducer(undefined, { type: 'unknown' })).toEqual({
            lastTransaction: null,
            history: [],
        })
    })

    it('should handle setLastTransaction', () => {
        const actual = transactionReducer(undefined, setLastTransaction(mockTransaction))
        expect(actual.lastTransaction).toEqual(mockTransaction)
        expect(actual.history).toHaveLength(1)
        expect(actual.history[0]).toEqual(mockTransaction)
    })

    it('should add to history and keep last 10', () => {
        let state = transactionReducer(undefined, { type: 'unknown' })

        // Add 12 transactions
        for (let i = 0; i < 12; i++) {
            state = transactionReducer(
                state,
                setLastTransaction({ ...mockTransaction, id: `${i}` })
            )
        }

        expect(state.history).toHaveLength(10)
    })

    it('should handle clearLastTransaction', () => {
        const initialState = {
            lastTransaction: mockTransaction,
            history: [mockTransaction],
        }
        const actual = transactionReducer(initialState, clearLastTransaction())
        expect(actual.lastTransaction).toBeNull()
        expect(actual.history).toHaveLength(1) // History not cleared
    })

    it('should handle clearHistory', () => {
        const initialState = {
            lastTransaction: mockTransaction,
            history: [mockTransaction],
        }
        const actual = transactionReducer(initialState, clearHistory())
        expect(actual.history).toHaveLength(0)
    })
})