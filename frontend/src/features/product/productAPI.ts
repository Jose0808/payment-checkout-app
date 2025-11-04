import apiClient from '@services/api'
import { Product, ApiResponse } from '@shared/types'

export const productAPI = {
    getAll: async (): Promise<Product[]> => {
        const response = await apiClient.get<ApiResponse<Product[]>>('/products')
        return response.data.data
    },

    getById: async (id: string): Promise<Product> => {
        const response = await apiClient.get<ApiResponse<Product>>(`/products/${id}`)
        return response.data.data
    },
}