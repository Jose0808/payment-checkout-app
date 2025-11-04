import { describe, it, expect, vi, beforeEach } from 'vitest'
import paymentReducer, {
    clearPayment,
    setCurrentTransaction,
    createTransaction,
    processPayment,
} from '../paymentSlice'
import { paymentAPI } from '../paymentAPI'
import { Transaction, TransactionStatus } from '@shared/types'

// 🧩 Mock del módulo completo
vi.mock('../paymentAPI', () => ({
    paymentAPI: {
        createTransaction: vi.fn(),
        processPayment: vi.fn(),
    },
}))

const mockTransaction: Transaction = {
    id: '1',
    transactionNumber: 'TXN-123',
    productId: 'prod-1',
    customerId: 'cust-1',
    productAmount: 100000,
    baseFee: 1000,
    deliveryFee: 5000,
    totalAmount: 106000,
    status: TransactionStatus.PENDING,
    paymentMethod: 'CARD',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
}

describe('paymentSlice', () => {
    const initialState = {
        currentTransaction: null,
        processing: false,
        error: null,
        fees: { baseFee: 1000, deliveryFee: 5000 },
    }

    beforeEach(() => {
        vi.clearAllMocks()
    })

    // 🧪 Reducers simples
    it('should return the initial state', () => {
        expect(paymentReducer(undefined, { type: 'unknown' })).toEqual(initialState)
    })

    it('should handle setCurrentTransaction', () => {
        const state = paymentReducer(undefined, setCurrentTransaction(mockTransaction))
        expect(state.currentTransaction).toEqual(mockTransaction)
    })

    it('should handle clearPayment', () => {
        const customState = {
            ...initialState,
            currentTransaction: mockTransaction,
            error: 'some error',
        }
        const result = paymentReducer(customState, clearPayment())
        expect(result.currentTransaction).toBeNull()
        expect(result.error).toBeNull()
    })

    // ⚙️ Async thunks: createTransaction
    describe('createTransaction thunk', () => {
        it('should handle fulfilled state', async () => {
            (paymentAPI.createTransaction as any).mockResolvedValue(mockTransaction)

            const dispatch = vi.fn()
            const getState = vi.fn()

            const thunk = createTransaction({
                productId: 'prod-1',
                customer: { email: 'a@a.com', fullName: 'A', phone: '123' },
            })

            const action = await thunk(dispatch, getState, undefined)

            expect(dispatch).toHaveBeenCalledWith(
                expect.objectContaining({ type: 'payment/createTransaction/pending' })
            )
            expect(dispatch).toHaveBeenCalledWith(
                expect.objectContaining({ type: 'payment/createTransaction/fulfilled' })
            )
            expect(action.payload).toEqual(mockTransaction)
        })

        it('should handle rejected state', async () => {
            (paymentAPI.createTransaction as any).mockRejectedValue({
                response: { data: { message: 'Create error' } },
            })

            const dispatch = vi.fn()
            const getState = vi.fn()

            const thunk = createTransaction({
                productId: 'prod-1',
                customer: { email: 'a@a.com', fullName: 'A', phone: '123' },
            })

            const action = await thunk(dispatch, getState, undefined)

            expect(action.type).toBe('payment/createTransaction/rejected')
            expect(action.payload).toBe('Create error')
        })
    })

    // ⚙️ Async thunks: processPayment
    describe('processPayment thunk', () => {
        const baseArgs = {
            transactionId: '1',
            card: {
                cardNumber: '4111111111111111',
                cardHolder: 'John Doe',
                expirationDate: '12/25',
                cvv: '123',
            },
            delivery: {
                address: 'Street 123',
                city: 'City',
                state: 'State',
                zipCode: '11111',
                country: 'Country',
            },
        }

        it('should handle fulfilled state', async () => {
            (paymentAPI.processPayment as any).mockResolvedValue(mockTransaction)

            const dispatch = vi.fn()
            const getState = vi.fn()

            const thunk = processPayment(baseArgs)
            const action = await thunk(dispatch, getState, undefined)

            expect(dispatch).toHaveBeenCalledWith(
                expect.objectContaining({ type: 'payment/processPayment/pending' })
            )
            expect(dispatch).toHaveBeenCalledWith(
                expect.objectContaining({ type: 'payment/processPayment/fulfilled' })
            )
            expect(action.payload).toEqual(mockTransaction)
        })

        it('should handle rejected state', async () => {
            (paymentAPI.processPayment as any).mockRejectedValue({
                response: { data: { message: 'Process error' } },
            })

            const dispatch = vi.fn()
            const getState = vi.fn()

            const thunk = processPayment(baseArgs)
            const action = await thunk(dispatch, getState, undefined)

            expect(action.type).toBe('payment/processPayment/rejected')
            expect(action.payload).toBe('Process error')
        })

        describe('paymentSlice reducers - extraReducers', () => {
            const baseState = {
                currentTransaction: null,
                processing: false,
                error: null,
                fees: { baseFee: 1000, deliveryFee: 5000 },
            }

            it('should handle createTransaction.pending', () => {
                const nextState = paymentReducer(baseState, { type: createTransaction.pending.type })
                expect(nextState.processing).toBe(true)
                expect(nextState.error).toBeNull()
            })

            it('should handle createTransaction.fulfilled', () => {
                const nextState = paymentReducer(baseState, {
                    type: createTransaction.fulfilled.type,
                    payload: mockTransaction,
                })
                expect(nextState.processing).toBe(false)
                expect(nextState.currentTransaction).toEqual(mockTransaction)
            })

            it('should handle createTransaction.rejected', () => {
                const nextState = paymentReducer(baseState, {
                    type: createTransaction.rejected.type,
                    payload: 'Error al crear',
                })
                expect(nextState.processing).toBe(false)
                expect(nextState.error).toBe('Error al crear')
            })

            it('should handle processPayment.pending', () => {
                const nextState = paymentReducer(baseState, { type: processPayment.pending.type })
                expect(nextState.processing).toBe(true)
                expect(nextState.error).toBeNull()
            })

            it('should handle processPayment.fulfilled', () => {
                const nextState = paymentReducer(baseState, {
                    type: processPayment.fulfilled.type,
                    payload: mockTransaction,
                })
                expect(nextState.processing).toBe(false)
                expect(nextState.currentTransaction).toEqual(mockTransaction)
            })

            it('should handle processPayment.rejected', () => {
                const nextState = paymentReducer(baseState, {
                    type: processPayment.rejected.type,
                    payload: 'Error al procesar',
                })
                expect(nextState.processing).toBe(false)
                expect(nextState.error).toBe('Error al procesar')
            })
        })

    })
})
