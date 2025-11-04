import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Alert } from '../Alert'

describe('Alert', () => {
    it('renders alert message', () => {
        render(<Alert message="Test message" />)
        expect(screen.getByText('Test message')).toBeInTheDocument()
    })

    it('renders with title', () => {
        render(<Alert title="Test Title" message="Test message" />)
        expect(screen.getByText('Test Title')).toBeInTheDocument()
    })

    it('calls onClose when close button clicked', () => {
        const onClose = vi.fn()
        render(<Alert message="Test" onClose={onClose} />)

        const closeButton = screen.getByRole('button')
        fireEvent.click(closeButton)

        expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('renders different types correctly', () => {
        const { rerender } = render(<Alert type="success" message="Success" />)
        expect(screen.getByText('Success')).toBeInTheDocument()

        rerender(<Alert type="error" message="Error" />)
        expect(screen.getByText('Error')).toBeInTheDocument()

        rerender(<Alert type="warning" message="Warning" />)
        expect(screen.getByText('Warning')).toBeInTheDocument()
    })
})