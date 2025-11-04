import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { PaymentModal } from '../components/PaymentModal'
import { Customer, CardInfo, DeliveryInfo } from '@shared/types'

// Mock child components to isolate PaymentModal logic
vi.mock('../components/ModernCardForm', () => ({
    ModernCardForm: ({ onSubmit }: { onSubmit: (customer: Customer, card: CardInfo) => void }) => (
        <div>
            <p>Card Form Mock</p>
            <button onClick={() => onSubmit(mockCustomer, mockCard)}>Submit Card</button>
        </div>
    ),
}))

vi.mock('../components/DeliveryForm', () => ({
    DeliveryForm: ({
        onSubmit,
        onBack,
    }: {
        onSubmit: (delivery: DeliveryInfo) => void
        onBack: () => void
    }) => (
        <div>
            <p>Delivery Form Mock</p>
            <button onClick={() => onSubmit(mockDelivery)}>Submit Delivery</button>
            <button onClick={onBack}>Go Back</button>
        </div>
    ),
}))

const mockCustomer: Customer = {
    fullName: 'John Doe',
    email: 'john@doe.com',
    phone: '1234567890',
}
const mockCard: CardInfo = {
    cardNumber: '4111111111111111',
    cardHolder: 'John Doe',
    expirationDate: '12/25',
    cvv: '123',
}
const mockDelivery: DeliveryInfo = {
    address: '123 Main St',
    city: 'Anytown',
    state: 'Anystate',
    zipCode: '12345',
    country: 'USA',
}

describe('PaymentModal', () => {
    let onClose: () => void
    let onSubmit: (customer: Customer, card: CardInfo, delivery: DeliveryInfo) => void

    beforeEach(() => {
        onClose = vi.fn()
        onSubmit = vi.fn()
        vi.clearAllMocks()
    })

    it('should not render when isOpen is false', () => {
        const { container } = render(
            <PaymentModal isOpen={false} onClose={onClose} onSubmit={onSubmit} />
        )
        expect(container.firstChild).toBeNull()
    })

    it('should render the card form by default when isOpen is true', () => {
        render(<PaymentModal isOpen={true} onClose={onClose} onSubmit={onSubmit} />)
        expect(screen.getByText('Información de Pago')).toBeInTheDocument()
        expect(screen.getByText('Card Form Mock')).toBeInTheDocument()
    })


    it('should transition to the delivery step when card form is submitted', () => {
        render(<PaymentModal isOpen={true} onClose={onClose} onSubmit={onSubmit} />)

        // Submit card form
        fireEvent.click(screen.getByText('Submit Card'))

        // Check for delivery form
        expect(screen.getByText('Información de Entrega')).toBeInTheDocument()
        expect(screen.getByText('Delivery Form Mock')).toBeInTheDocument()
        expect(screen.queryByText('Card Form Mock')).not.toBeInTheDocument()
    })

    it('should call the final onSubmit with all data when delivery form is submitted', () => {
        render(<PaymentModal isOpen={true} onClose={onClose} onSubmit={onSubmit} />)

        // Step 1: Submit card form
        fireEvent.click(screen.getByText('Submit Card'))

        // Step 2: Submit delivery form
        fireEvent.click(screen.getByText('Submit Delivery'))

        // Check if final onSubmit was called with combined data
        expect(onSubmit).toHaveBeenCalledTimes(1)
        expect(onSubmit).toHaveBeenCalledWith(mockCustomer, mockCard, mockDelivery)
    })

    it('should transition back to the card step from the delivery step', () => {
        render(<PaymentModal isOpen={true} onClose={onClose} onSubmit={onSubmit} />)

        // Go to delivery step
        fireEvent.click(screen.getByText('Submit Card'))
        expect(screen.getByText('Información de Entrega')).toBeInTheDocument()

        // Go back
        fireEvent.click(screen.getByText('Go Back'))

        // Check for card form
        expect(screen.getByText('Información de Pago')).toBeInTheDocument()
        expect(screen.getByText('Card Form Mock')).toBeInTheDocument()
    })
})