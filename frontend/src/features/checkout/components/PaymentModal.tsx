import React, { useState } from 'react'
import { X } from 'lucide-react'
import { ModernCardForm as CardForm} from './ModernCardForm'
import { DeliveryForm } from './DeliveryForm'
import { Customer, CardInfo, DeliveryInfo } from '@shared/types'

interface PaymentModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (customer: Customer, card: CardInfo, delivery: DeliveryInfo) => void
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [step, setStep] = useState<'card' | 'delivery'>('card')
    const [cardData, setCardData] = useState<CardInfo | null>(null)
    const [customerData, setCustomerData] = useState<Customer | null>(null)

    if (!isOpen) return null

    const handleCardSubmit = (customer: Customer, card: CardInfo) => {
        setCustomerData(customer)
        setCardData(card)
        setStep('delivery')
    }

    const handleDeliverySubmit = (delivery: DeliveryInfo) => {
        if (customerData && cardData) {
            onSubmit(customerData, cardData, delivery)
        }
    }

    const handleBack = () => {
        setStep('card')
    }

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />

            {/* Modal */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl transform transition-all">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b">
                        <h2 className="text-2xl font-bold text-gray-900">
                            {step === 'card' ? 'Información de Pago' : 'Información de Entrega'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X className="w-6 h-6 text-gray-500" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {step === 'card' ? (
                            <CardForm onSubmit={handleCardSubmit} />
                        ) : (
                            <DeliveryForm onSubmit={handleDeliverySubmit} onBack={handleBack} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}