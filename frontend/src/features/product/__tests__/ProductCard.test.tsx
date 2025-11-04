import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ProductCard } from '../components/ProductCard'
import { Product } from '@shared/types'

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

describe('ProductCard', () => {
    it('renders product information correctly', () => {
        const onBuyClick = vi.fn()
        render(<ProductCard product={mockProduct} onBuyClick={onBuyClick} />)

        expect(screen.getByText('Test Product')).toBeInTheDocument()
        expect(screen.getByText('Test Description')).toBeInTheDocument()
        expect(screen.getByText(/50 disponibles/)).toBeInTheDocument()
    })

    it('calls onBuyClick when button is clicked', () => {
        const onBuyClick = vi.fn()
        render(<ProductCard product={mockProduct} onBuyClick={onBuyClick} />)

        const button = screen.getByText(/Pay with credit card/)
        fireEvent.click(button)

        expect(onBuyClick).toHaveBeenCalledWith(mockProduct)
    })

    it('disables button when out of stock', () => {
        const outOfStockProduct = { ...mockProduct, stock: 0 }
        const onBuyClick = vi.fn()
        render(<ProductCard product={outOfStockProduct} onBuyClick={onBuyClick} />)

        const button = screen.getByText(/No disponible/)
        expect(button).toBeDisabled()
    })
})