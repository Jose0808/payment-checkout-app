import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Mail, User, Phone, CreditCard, Calendar, Lock, Info } from 'lucide-react'
import { Customer, CardInfo, CardType } from '@shared/types'
import {
    validateCardNumber,
    validateExpirationDate,
    validateCVV,
    validateEmail,
    validatePhone,
} from '@shared/utils/validators'
import { formatCardNumber, formatExpirationDate } from '@shared/utils/formatters'
import { detectCardType } from '@shared/utils/cardDetector'
import { CreditCardDisplay } from './CreditCardDisplay'

interface CardFormData {
    email: string
    fullName: string
    phone: string
    cardNumber: string
    cardHolder: string
    expirationDate: string
    cvv: string
}

interface ModernCardFormProps {
    onSubmit: (customer: Customer, card: CardInfo) => void
}

export const ModernCardForm: React.FC<ModernCardFormProps> = ({ onSubmit }) => {
    const [cardType, setCardType] = useState<CardType>(CardType.UNKNOWN)
    const [showBack, setShowBack] = useState(false)
    const [focusedField, setFocusedField] = useState<string>('')

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
    } = useForm<CardFormData>()

    const cardNumber = watch('cardNumber', '')
    const cardHolder = watch('cardHolder', '')
    const expirationDate = watch('expirationDate', '')
    const cvv = watch('cvv', '')

    useEffect(() => {
        const type = detectCardType(cardNumber)
        setCardType(type)
    }, [cardNumber])

    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatCardNumber(e.target.value.replace(/\s/g, ''))
        setValue('cardNumber', formatted)
    }

    const handleExpirationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatExpirationDate(e.target.value)
        setValue('expirationDate', formatted)
    }

    const onFormSubmit = (data: CardFormData) => {
        const customer: Customer = {
            email: data.email,
            fullName: data.fullName,
            phone: data.phone,
        }

        const card: CardInfo = {
            cardNumber: data.cardNumber.replace(/\s/g, ''),
            cardHolder: data.cardHolder,
            expirationDate: data.expirationDate,
            cvv: data.cvv,
        }

        onSubmit(customer, card)
    }

    return (
        <div className="max-w-5x1 mx-auto">
            <form onSubmit={handleSubmit(onFormSubmit)} className="grid md:grid-cols-2 gap-8">
                {/* Left Side - Credit Card Display */}
                <div className="order-1 md:order-2">
                    <div className="sticky top-8">
                        <h3 className="text-sm font-medium text-gray-700 mb-6 text-center">
                            Vista previa de tu tarjeta
                        </h3>
                        <CreditCardDisplay
                            cardNumber={cardNumber}
                            cardHolder={cardHolder}
                            expirationDate={expirationDate}
                            cvv={cvv}
                            cardType={cardType}
                            showBack={showBack}
                        />

                        {/* Test Cards Info */}
                        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                            <div className="flex items-start gap-2">
                                <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                <div className="text-sm text-blue-900">
                                    <p className="font-semibold mb-2">Tarjetas de prueba:</p>
                                    <ul className="space-y-1 text-xs">
                                        <li>💳 Visa: 4111 1111 1111 1111</li>
                                        <li>💳 Mastercard: 5555 5555 5555 4444</li>
                                        <li>📅 Fecha: Cualquier fecha futura</li>
                                        <li>🔒 CVV: Cualquier 3 dígitos</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="order-2 md:order-1 space-y-6">
                    {/* Customer Info Section */}
                    <div className="card">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <User className="w-5 h-5 text-primary" />
                            Información Personal
                        </h3>

                        <div className="space-y-4">
                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    <Mail className="w-4 h-4 inline mr-1.5" />
                                    Correo Electrónico
                                </label>
                                <input
                                    type="email"
                                    {...register('email', {
                                        required: 'El email es requerido',
                                        validate: value => validateEmail(value) || 'Email inválido',
                                    })}
                                    className={`input ${errors.email ? 'border-error' : ''}`}
                                    placeholder="tu@email.com"
                                    onFocus={() => setFocusedField('email')}
                                    onBlur={() => setFocusedField('')}
                                />
                                {errors.email && (
                                    <p className="text-error text-sm mt-1.5 flex items-center gap-1">
                                        <span className="text-xs">⚠</span> {errors.email.message}
                                    </p>
                                )}
                            </div>

                            {/* Full Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    <User className="w-4 h-4 inline mr-1.5" />
                                    Nombre Completo
                                </label>
                                <input
                                    type="text"
                                    {...register('fullName', {
                                        required: 'El nombre es requerido',
                                        minLength: { value: 3, message: 'Mínimo 3 caracteres' },
                                    })}
                                    className={`input ${errors.fullName ? 'border-error' : ''}`}
                                    placeholder="Juan Pérez"
                                />
                                {errors.fullName && (
                                    <p className="text-error text-sm mt-1.5 flex items-center gap-1">
                                        <span className="text-xs">⚠</span> {errors.fullName.message}
                                    </p>
                                )}
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    <Phone className="w-4 h-4 inline mr-1.5" />
                                    Teléfono
                                </label>
                                <input
                                    type="tel"
                                    {...register('phone', {
                                        required: 'El teléfono es requerido',
                                        validate: value => validatePhone(value) || 'Teléfono inválido',
                                    })}
                                    className={`input ${errors.phone ? 'border-error' : ''}`}
                                    placeholder="+57 300 123 4567"
                                />
                                {errors.phone && (
                                    <p className="text-error text-sm mt-1.5 flex items-center gap-1">
                                        <span className="text-xs">⚠</span> {errors.phone.message}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Card Info Section */}
                    <div className="card">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-primary" />
                            Información de la Tarjeta
                        </h3>

                        <div className="space-y-4">
                            {/* Card Number */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Número de Tarjeta
                                    {cardType !== CardType.UNKNOWN && (
                                        <span className="ml-2 text-primary text-xs font-semibold">
                                            {cardType} detectado ✓
                                        </span>
                                    )}
                                </label>
                                <input
                                    type="text"
                                    {...register('cardNumber', {
                                        required: 'El número de tarjeta es requerido',
                                        validate: value =>
                                            validateCardNumber(value.replace(/\s/g, '')) ||
                                            'Número de tarjeta inválido',
                                    })}
                                    onChange={handleCardNumberChange}
                                    className={`input font-mono ${errors.cardNumber ? 'border-error' : ''}`}
                                    placeholder="1234 5678 9012 3456"
                                    maxLength={19}
                                    onFocus={() => setShowBack(false)}
                                />
                                {errors.cardNumber && (
                                    <p className="text-error text-sm mt-1.5 flex items-center gap-1">
                                        <span className="text-xs">⚠</span> {errors.cardNumber.message}
                                    </p>
                                )}
                            </div>

                            {/* Card Holder */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Titular de la Tarjeta
                                </label>
                                <input
                                    type="text"
                                    {...register('cardHolder', {
                                        required: 'El titular es requerido',
                                        minLength: { value: 3, message: 'Mínimo 3 caracteres' },
                                    })}
                                    className={`input uppercase ${errors.cardHolder ? 'border-error' : ''}`}
                                    placeholder="JUAN PEREZ"
                                    onFocus={() => setShowBack(false)}
                                />
                                {errors.cardHolder && (
                                    <p className="text-error text-sm mt-1.5 flex items-center gap-1">
                                        <span className="text-xs">⚠</span> {errors.cardHolder.message}
                                    </p>
                                )}
                            </div>

                            {/* Expiration and CVV */}
                            <div className="grid grid-cols-2 gap-4">
                                {/* Expiration */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        <Calendar className="w-4 h-4 inline mr-1.5" />
                                        Vencimiento
                                    </label>
                                    <input
                                        type="text"
                                        {...register('expirationDate', {
                                            required: 'La fecha es requerida',
                                            validate: value =>
                                                validateExpirationDate(value) || 'Fecha inválida o expirada',
                                        })}
                                        onChange={handleExpirationChange}
                                        className={`input font-mono ${errors.expirationDate ? 'border-error' : ''
                                            }`}
                                        placeholder="MM/YY"
                                        maxLength={5}
                                        onFocus={() => setShowBack(false)}
                                    />
                                    {errors.expirationDate && (
                                        <p className="text-error text-sm mt-1.5 flex items-center gap-1">
                                            <span className="text-xs">⚠</span> {errors.expirationDate.message}
                                        </p>
                                    )}
                                </div>

                                {/* CVV */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        <Lock className="w-4 h-4 inline mr-1.5" />
                                        CVV
                                    </label>
                                    <input
                                        type="text"
                                        {...register('cvv', {
                                            required: 'El CVV es requerido',
                                            validate: value => validateCVV(value) || 'CVV inválido',
                                        })}
                                        className={`input font-mono ${errors.cvv ? 'border-error' : ''}`}
                                        placeholder="123"
                                        maxLength={4}
                                        onFocus={() => setShowBack(true)}
                                        onBlur={() => setShowBack(false)}
                                    />
                                    {errors.cvv && (
                                        <p className="text-error text-sm mt-1.5 flex items-center gap-1">
                                            <span className="text-xs">⚠</span> {errors.cvv.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full btn-primary py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-shadow"
                    >
                        Continuar a Entrega →
                    </button>
                </div>
            </form>
        </div>
    )
}