import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { CreditCard, User, Mail, Phone } from 'lucide-react'
import { Customer, CardInfo, CardType } from '@shared/types'
import {
    validateCardNumber,
    validateExpirationDate,
    validateCVV,
    validateEmail,
    validatePhone,
} from '@shared/utils/validators'
import { formatCardNumber, formatExpirationDate } from '@shared/utils/formatters'
import { detectCardType, getCardIcon } from '@shared/utils/cardDetector'

interface CardFormData {
    email: string
    fullName: string
    phone: string
    cardNumber: string
    cardHolder: string
    expirationDate: string
    cvv: string
}

interface CardFormProps {
    onSubmit: (customer: Customer, card: CardInfo) => void
}

export const CardForm: React.FC<CardFormProps> = ({ onSubmit }) => {
    const [cardType, setCardType] = useState<CardType>(CardType.UNKNOWN)
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
    } = useForm<CardFormData>()

    const cardNumber = watch('cardNumber', '')

    React.useEffect(() => {
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
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
            {/* Customer Info */}
            <div className="space-y-4">
                <h3 className="font-semibold text-lg">Información del Cliente</h3>

                {/* Email */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        <Mail className="w-4 h-4 inline mr-1" />
                        Correo Electrónico
                    </label>
                    <input
                        type="email"
                        {...register('email', {
                            required: 'Email es requerido',
                            validate: value => validateEmail(value) || 'Email inválido',
                        })}
                        className="input"
                        placeholder="tu@email.com"
                    />
                    {errors.email && (
                        <p className="text-error text-sm mt-1">{errors.email.message}</p>
                    )}
                </div>

                {/* Full Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        <User className="w-4 h-4 inline mr-1" />
                        Nombre Completo
                    </label>
                    <input
                        type="text"
                        {...register('fullName', {
                            required: 'Nombre es requerido',
                            minLength: { value: 3, message: 'Mínimo 3 caracteres' },
                        })}
                        className="input"
                        placeholder="Juan Pérez"
                    />
                    {errors.fullName && (
                        <p className="text-error text-sm mt-1">{errors.fullName.message}</p>
                    )}
                </div>

                {/* Phone */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        <Phone className="w-4 h-4 inline mr-1" />
                        Teléfono
                    </label>
                    <input
                        type="tel"
                        {...register('phone', {
                            required: 'Teléfono es requerido',
                            validate: value => validatePhone(value) || 'Teléfono inválido',
                        })}
                        className="input"
                        placeholder="+57 300 123 4567"
                    />
                    {errors.phone && (
                        <p className="text-error text-sm mt-1">{errors.phone.message}</p>
                    )}
                </div>
            </div>

            {/* Card Info */}
            <div className="space-y-4 pt-4 border-t">
                <h3 className="font-semibold text-lg">
                    <CreditCard className="w-5 h-5 inline mr-2" />
                    Información de la Tarjeta
                </h3>

                {/* Card Number */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Número de Tarjeta
                        {cardType !== CardType.UNKNOWN && (
                            <span className="ml-2 text-primary">{getCardIcon(cardType)}</span>
                        )}
                    </label>
                    <input
                        type="text"
                        {...register('cardNumber', {
                            required: 'Número de tarjeta es requerido',
                            validate: value =>
                                validateCardNumber(value.replace(/\s/g, '')) || 'Número de tarjeta inválido',
                        })}
                        onChange={handleCardNumberChange}
                        className="input"
                        placeholder="4111 1111 1111 1111"
                        maxLength={19}
                    />
                    {errors.cardNumber && (
                        <p className="text-error text-sm mt-1">{errors.cardNumber.message}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                        Usa: 4111111111111111 (Visa) o 5555555555554444 (Mastercard)
                    </p>
                </div>

                {/* Card Holder */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Titular de la Tarjeta
                    </label>
                    <input
                        type="text"
                        {...register('cardHolder', {
                            required: 'Titular es requerido',
                            minLength: { value: 3, message: 'Mínimo 3 caracteres' },
                        })}
                        className="input uppercase"
                        placeholder="JUAN PEREZ"
                    />
                    {errors.cardHolder && (
                        <p className="text-error text-sm mt-1">{errors.cardHolder.message}</p>
                    )}
                </div>

                {/* Expiration and CVV */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Expiration */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Vencimiento
                        </label>
                        <input
                            type="text"
                            {...register('expirationDate', {
                                required: 'Fecha es requerida',
                                validate: value =>
                                    validateExpirationDate(value) || 'Fecha inválida o expirada',
                            })}
                            onChange={handleExpirationChange}
                            className="input"
                            placeholder="MM/YY"
                            maxLength={5}
                        />
                        {errors.expirationDate && (
                            <p className="text-error text-sm mt-1">{errors.expirationDate.message}</p>
                        )}
                    </div>

                    {/* CVV */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                        <input
                            type="text"
                            {...register('cvv', {
                                required: 'CVV es requerido',
                                validate: value => validateCVV(value) || 'CVV inválido',
                            })}
                            className="input"
                            placeholder="123"
                            maxLength={4}
                        />
                        {errors.cvv && <p className="text-error text-sm mt-1">{errors.cvv.message}</p>}
                    </div>
                </div>
            </div>

            {/* Submit */}
            <button type="submit" className="w-full btn-primary">
                Continuar a Entrega
            </button>
        </form>
    )
}