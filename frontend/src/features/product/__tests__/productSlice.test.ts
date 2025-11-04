import { describe, it, expect, vi, beforeEach } from 'vitest'
import productReducer, {
    selectProduct,
    clearSelectedProduct,
    updateProductStock,
    fetchProducts,
    fetchProductById,
} from '../productSlice'
import { Product } from '@shared/types'
import { productAPI } from '../productAPI'

// 🧩 Mock del módulo completo
vi.mock('../productAPI', () => ({
    productAPI: {
        getAll: vi.fn(),
        getById: vi.fn(),
    },
}))

const mockProduct: Product = {
    id: '1',
    name: 'Test Product',
    description: 'Test Description',
    price: 100000,
    stock: 50,
    imageUrl: 'https://example.com/image.jpg',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
}

describe('productSlice', () => {
    const initialState = {
        products: [],
        selectedProduct: null,
        loading: false,
        error: null,
    }

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should return the initial state', () => {
        expect(productReducer(undefined, { type: 'unknown' })).toEqual(initialState)
    })

    it('should handle selectProduct', () => {
        const actual = productReducer(undefined, selectProduct(mockProduct))
        expect(actual.selectedProduct).toEqual(mockProduct)
    })

    it('should handle clearSelectedProduct', () => {
        const stateWithProduct = { ...initialState, selectedProduct: mockProduct }
        const actual = productReducer(stateWithProduct, clearSelectedProduct())
        expect(actual.selectedProduct).toBeNull()
    })

    it('should handle updateProductStock', () => {
        const stateWithProduct = {
            ...initialState,
            products: [mockProduct],
            selectedProduct: mockProduct,
        }
        const actual = productReducer(
            stateWithProduct,
            updateProductStock({ productId: '1', newStock: 45 })
        )
        expect(actual.products[0].stock).toBe(45)
        expect(actual.selectedProduct?.stock).toBe(45)
    })

    // ⚙️ Async thunks: fetchProducts
    describe('fetchProducts thunk', () => {
        it('should handle fulfilled state and update reducer', async () => {
            const mockProducts = [mockProduct]
                ; (productAPI.getAll as any).mockResolvedValue(mockProducts)

            const dispatch = vi.fn()
            const getState = vi.fn()

            const thunk = fetchProducts()
            const action = await thunk(dispatch, getState, undefined)

            // Test thunk action
            expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'product/fetchProducts/pending' }))
            expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'product/fetchProducts/fulfilled' }))
            expect(action.payload).toEqual(mockProducts)

            // Test reducer logic
            const pendingState = productReducer(initialState, { type: 'product/fetchProducts/pending' })
            expect(pendingState.loading).toBe(true)
            expect(pendingState.error).toBeNull()

            const fulfilledState = productReducer(pendingState, action)
            expect(fulfilledState.loading).toBe(false)
            expect(fulfilledState.products).toEqual(mockProducts)
        })

        it('should handle rejected state and update reducer', async () => {
            ; (productAPI.getAll as any).mockRejectedValue({
                response: { data: { message: 'Fetch error' } },
            })

            const dispatch = vi.fn()
            const getState = vi.fn()

            const thunk = fetchProducts()
            const action = await thunk(dispatch, getState, undefined)

            // Test thunk action
            expect(action.type).toBe('product/fetchProducts/rejected')
            expect(action.payload).toBe('Fetch error')

            // Test reducer logic
            const pendingState = productReducer(initialState, { type: 'product/fetchProducts/pending' })
            const rejectedState = productReducer(pendingState, action)
            expect(rejectedState.loading).toBe(false)
            expect(rejectedState.error).toBe('Fetch error')
        })
    })

    // ⚙️ Async thunks: fetchProductById
    describe('fetchProductById thunk', () => {
        it('should handle fulfilled state and update reducer', async () => {
            ; (productAPI.getById as any).mockResolvedValue(mockProduct)

            const dispatch = vi.fn()
            const getState = vi.fn()

            const thunk = fetchProductById('1')
            const action = await thunk(dispatch, getState, undefined)

            // Test thunk action
            expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'product/fetchProductById/pending' }))
            expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'product/fetchProductById/fulfilled' }))
            expect(action.payload).toEqual(mockProduct)

            // Test reducer logic
            const pendingState = productReducer(initialState, { type: 'product/fetchProductById/pending' })
            expect(pendingState.loading).toBe(true)
            expect(pendingState.error).toBeNull()

            const fulfilledState = productReducer(pendingState, action)
            expect(fulfilledState.loading).toBe(false)
            expect(fulfilledState.selectedProduct).toEqual(mockProduct)
        })

        it('should handle rejected state and update reducer', async () => {
            ; (productAPI.getById as any).mockRejectedValue({
                response: { data: { message: 'Fetch by ID error' } },
            })

            const dispatch = vi.fn()
            const getState = vi.fn()

            const thunk = fetchProductById('1')
            const action = await thunk(dispatch, getState, undefined)

            // Test thunk action
            expect(action.type).toBe('product/fetchProductById/rejected')
            expect(action.payload).toBe('Fetch by ID error')

            // Test reducer logic
            const pendingState = productReducer(initialState, {
                type: 'product/fetchProductById/pending',
            })
            const rejectedState = productReducer(pendingState, action)
            expect(rejectedState.loading).toBe(false)
            expect(rejectedState.error).toBe('Fetch by ID error')
        })
    })
})