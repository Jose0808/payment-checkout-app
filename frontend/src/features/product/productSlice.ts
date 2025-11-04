import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { Product } from '@shared/types'
import { productAPI } from './productAPI'

interface ProductState {
    products: Product[]
    selectedProduct: Product | null
    loading: boolean
    error: string | null
}

const initialState: ProductState = {
    products: [],
    selectedProduct: null,
    loading: false,
    error: null,
}

// Async thunks
export const fetchProducts = createAsyncThunk(
    'product/fetchProducts',
    async (_, { rejectWithValue }) => {
        try {
            return await productAPI.getAll()
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch products')
        }
    }
)

export const fetchProductById = createAsyncThunk(
    'product/fetchProductById',
    async (id: string, { rejectWithValue }) => {
        try {
            return await productAPI.getById(id)
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch product')
        }
    }
)

const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        selectProduct: (state, action: PayloadAction<Product>) => {
            state.selectedProduct = action.payload
        },
        clearSelectedProduct: state => {
            state.selectedProduct = null
        },
        updateProductStock: (state, action: PayloadAction<{ productId: string; newStock: number }>) => {
            const product = state.products.find(p => p.id === action.payload.productId)
            if (product) {
                product.stock = action.payload.newStock
            }
            if (state.selectedProduct?.id === action.payload.productId) {
                state.selectedProduct.stock = action.payload.newStock
            }
        },
    },
    extraReducers: builder => {
        builder
            // Fetch all products
            .addCase(fetchProducts.pending, state => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false
                state.products = action.payload
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
            // Fetch product by ID
            .addCase(fetchProductById.pending, state => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchProductById.fulfilled, (state, action) => {
                state.loading = false
                state.selectedProduct = action.payload
            })
            .addCase(fetchProductById.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
    },
})

export const { selectProduct, clearSelectedProduct, updateProductStock } = productSlice.actions
export default productSlice.reducer
