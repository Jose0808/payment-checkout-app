import axios, { AxiosInstance, AxiosError } from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'

class ApiService {
    private client: AxiosInstance

    constructor() {
        this.client = axios.create({
            baseURL: API_URL,
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json',
            },
        })

        // Request interceptor
        this.client.interceptors.request.use(
            config => {
                // Aquí podrías agregar tokens si fuera necesario
                return config
            },
            error => Promise.reject(error)
        )

        // Response interceptor
        this.client.interceptors.response.use(
            response => response,
            (error: AxiosError) => {
                // Manejar errores globalmente
                if (error.response) {
                    console.error('API Error:', error.response.data)
                } else if (error.request) {
                    console.error('Network Error:', error.request)
                }
                return Promise.reject(error)
            }
        )
    }

    getInstance() {
        return this.client
    }
}

export const apiClient = new ApiService().getInstance()
export default apiClient
