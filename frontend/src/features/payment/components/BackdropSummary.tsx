import React from 'react'
import { Product, Customer, DeliveryInfo } from '@shared/types'
import { formatCurrency } from '@shared/utils/formatters'
import { X, CreditCard, MapPin, User, ShoppingBag, Loader2 } from 'lucide-react'

interface BackdropSummaryProps {
    isOpen: boolean
    product: Product
    customer: Customer
    delivery: DeliveryInfo
    cardLast4: string
    baseFee: number
    deliveryFee: number
    onConfirm: () => void
    onClose: () => void
    processing?: boolean
}

export const BackdropSummary: React.FC<BackdropSummaryProps> = ({
    isOpen,
    product,
    customer,
    delivery,
    cardLast4,
    baseFee,
    deliveryFee,
    onConfirm,
    onClose,
    processing = false,
}) => {
    if (!isOpen) return null

    const subtotal = product.price
    const total = subtotal + baseFee + deliveryFee

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-60 transition-opacity"
                onClick={onClose}
            />

            {/* Backdrop Panel (Material Design) */}
            <div className="flex fixed items-center justify-center inset-x-0 bottom-0 transform transition-transform duration-300">
                <div className="bg-white  max-w-5xl rounded-t-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
                    {/* Handle */}
                    <div className="flex justify-center pt-4 pb-2">
                        <div className="w-12 h-1 bg-gray-300 rounded-full" />
                    </div>

                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b">
                        <h2 className="text-2xl font-bold text-gray-900">Resumen de Compra</h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            disabled={processing}
                        >
                            <X className="w-6 h-6 text-gray-500" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="px-6 py-6 space-y-6">
                        {/* Product */}
                        <div className="flex gap-4">
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-20 h-20 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900">{product.name}</h3>
                                <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                                <p className="text-lg font-bold text-primary mt-1">
                                    {formatCurrency(product.price)}
                                </p>
                            </div>
                        </div>

                        <div className="border-t pt-4 space-y-4">
                            {/* Customer */}
                            <div className="flex items-start gap-3">
                                <User className="w-5 h-5 text-gray-400 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-700">Cliente</p>
                                    <p className="text-sm text-gray-900">{customer.fullName}</p>
                                    <p className="text-sm text-gray-600">{customer.email}</p>
                                    <p className="text-sm text-gray-600">{customer.phone}</p>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="flex items-start gap-3">
                                <CreditCard className="w-5 h-5 text-gray-400 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-700">Método de Pago</p>
                                    <p className="text-sm text-gray-900">
                                        Tarjeta terminada en {cardLast4}
                                    </p>
                                </div>
                            </div>

                            {/* Delivery */}
                            <div className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-700">Dirección de Entrega</p>
                                    <p className="text-sm text-gray-900">{delivery.address}</p>
                                    <p className="text-sm text-gray-600">
                                        {delivery.city}, {delivery.state} {delivery.zipCode}
                                    </p>
                                    <p className="text-sm text-gray-600">{delivery.country}</p>
                                </div>
                            </div>
                        </div>

                        {/* Price Breakdown */}
                        <div className="border-t pt-4 space-y-2">
                            <div className="flex justify-between text-gray-700">
                                <span>Subtotal</span>
                                <span>{formatCurrency(subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-gray-700">
                                <span>Tarifa base</span>
                                <span>{formatCurrency(baseFee)}</span>
                            </div>
                            <div className="flex justify-between text-gray-700">
                                <span>Envío</span>
                                <span>{formatCurrency(deliveryFee)}</span>
                            </div>
                            <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t">
                                <span>Total</span>
                                <span className="text-primary">{formatCurrency(total)}</span>
                            </div>
                        </div>

                        {/* Confirm Button */}
                        <button
                            onClick={onConfirm}
                            disabled={processing}
                            className="w-full btn-primary py-4 text-lg font-semibold disabled:opacity-50"
                        >
                            {processing ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin inline mr-2" />
                                    Procesando...
                                </>
                            ) : (
                                <>
                                    <ShoppingBag className="w-5 h-5 inline mr-2" />
                                    Confirmar Pago
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}