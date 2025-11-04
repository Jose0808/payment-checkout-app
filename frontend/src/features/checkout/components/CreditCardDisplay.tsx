import React from 'react'
import { CardType } from '@shared/types'
import { maskCardNumber } from '@shared/utils/formatters'

interface CreditCardDisplayProps {
    cardNumber: string
    cardHolder: string
    expirationDate: string
    cvv: string
    cardType: CardType
    showBack?: boolean
}

export const CreditCardDisplay: React.FC<CreditCardDisplayProps> = ({
    cardNumber,
    cardHolder,
    expirationDate,
    cvv,
    cardType,
    showBack = false,
}) => {
    const getCardGradient = () => {
        switch (cardType) {
            case CardType.VISA:
                return 'from-blue-600 via-blue-700 to-blue-900'
            case CardType.MASTERCARD:
                return 'from-red-500 via-orange-600 to-yellow-600'
            case CardType.AMEX:
                return 'from-blue-400 via-blue-600 to-blue-800'
            default:
                return 'from-gray-700 via-gray-800 to-gray-900'
        }
    }

    const getCardLogo = () => {
        switch (cardType) {
            case CardType.VISA:
                return (
                    <div className="text-white font-bold text-3xl italic">
                        <span className="bg-white text-blue-600 px-2 py-1 rounded">VISA</span>
                    </div>
                )
            case CardType.MASTERCARD:
                return (
                    <div className="flex gap-1">
                        <div className="w-10 h-10 rounded-full bg-red-500 opacity-90" />
                        <div className="w-10 h-10 rounded-full bg-yellow-500 opacity-90 -ml-5" />
                    </div>
                )
            case CardType.AMEX:
                return (
                    <div className="text-white font-bold text-2xl">
                        <span className="bg-white text-blue-600 px-3 py-1 rounded">AMEX</span>
                    </div>
                )
            default:
                return (
                    <div className="w-12 h-12 rounded-lg border-2 border-white/30 flex items-center justify-center">
                        <svg
                            className="w-8 h-8 text-white/50"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                            />
                        </svg>
                    </div>
                )
        }
    }

    const displayNumber = cardNumber || '#### #### #### ####'
    const displayHolder = cardHolder || 'NOMBRE APELLIDO'
    const displayExpiry = expirationDate || 'MM/YY'
    const displayCvv = cvv || '***'

    return (
        <div className="perspective-1000 w-full max-w-md mx-auto">
            <div
                className={`relative transition-transform duration-700 transform-style-3d ${showBack ? 'rotate-y-180' : ''
                    }`}
            >
                {/* Front of Card */}
                <div
                    className={`absolute inset-0 w-full h-56 rounded-2xl shadow-2xl backface-hidden ${showBack ? 'opacity-0' : 'opacity-100'
                        }`}
                >
                    <div
                        className={`w-full h-full rounded-2xl bg-gradient-to-br ${getCardGradient()} p-6 text-white relative overflow-hidden`}
                    >
                        {/* Card Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl -mr-32 -mt-32" />
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl -ml-32 -mb-32" />
                        </div>

                        {/* Chip */}
                        <div className="absolute top-6 left-6">
                            <div className="w-12 h-10 rounded bg-gradient-to-br from-yellow-200 to-yellow-400 opacity-80">
                                <div className="grid grid-cols-2 gap-0.5 p-1 h-full">
                                    <div className="bg-yellow-600 rounded-sm" />
                                    <div className="bg-yellow-600 rounded-sm" />
                                    <div className="bg-yellow-600 rounded-sm" />
                                    <div className="bg-yellow-600 rounded-sm" />
                                </div>
                            </div>
                        </div>

                        {/* Card Logo */}
                        <div className="absolute top-6 right-6">{getCardLogo()}</div>

                        {/* Card Number */}
                        <div className="absolute top-24 left-6 right-6">
                            <div className="text-2xl font-mono tracking-wider">
                                {maskCardNumber(displayNumber)}
                            </div>
                        </div>

                        {/* Card Holder and Expiry */}
                        <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                            <div>
                                <div className="text-xs text-white/70 uppercase tracking-wide mb-1">
                                    Titular
                                </div>
                                <div className="font-semibold uppercase tracking-wide text-sm">
                                    {displayHolder}
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-white/70 uppercase tracking-wide mb-1">
                                    Vence
                                </div>
                                <div className="font-semibold tracking-wider">{displayExpiry}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Back of Card */}
                <div
                    className={`w-full h-56 rounded-2xl shadow-2xl rotate-y-180 ${showBack ? 'opacity-100' : 'opacity-0'
                        }`}
                >
                    <div
                        className={`w-full h-full rounded-2xl bg-gradient-to-br ${getCardGradient()} relative overflow-hidden`}
                    >
                        {/* Magnetic Stripe */}
                        <div className="absolute top-6 left-0 right-0 h-12 bg-black" />

                        {/* CVV Strip */}
                        <div className="absolute top-24 left-6 right-6">
                            <div className="bg-white rounded p-3 flex justify-between items-center">
                                <div className="text-xs text-gray-500 uppercase tracking-wide">CVV</div>
                                <div className="font-mono font-bold text-gray-900 text-lg tracking-widest">
                                    {'*'.repeat(displayCvv.length)}
                                </div>
                            </div>
                        </div>

                        {/* Card Logo on Back */}
                        <div className="absolute bottom-6 right-6">{getCardLogo()}</div>

                        {/* Warning Text */}
                        <div className="absolute bottom-6 left-6 text-xs text-white/70 max-w-xs">
                            Esta tarjeta es propiedad del banco emisor. Si la encuentra, devuélvala
                            inmediatamente.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}