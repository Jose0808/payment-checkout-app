import React from 'react'
import { Transaction, TransactionStatus } from '@shared/types'
import { formatCurrency } from '@shared/utils/formatters'
import { CheckCircle, XCircle, AlertCircle, Home } from 'lucide-react'

interface TransactionResultProps {
    transaction: Transaction
    onBackToProducts: () => void
}

export const TransactionResult: React.FC<TransactionResultProps> = ({
    transaction,
    onBackToProducts,
}) => {
    const isApproved = transaction.status === TransactionStatus.APPROVED
    const isDeclined = transaction.status === TransactionStatus.DECLINED
    // const isError = transaction.status === TransactionStatus.ERROR

    const getStatusConfig = () => {
        if (isApproved) {
            return {
                icon: CheckCircle,
                color: 'text-success',
                bgColor: 'bg-green-50',
                title: '¡Pago Exitoso!',
                message: 'Tu compra ha sido procesada correctamente',
            }
        }
        if (isDeclined) {
            return {
                icon: XCircle,
                color: 'text-error',
                bgColor: 'bg-red-50',
                title: 'Pago Rechazado',
                message: 'Tu tarjeta fue rechazada. Por favor intenta con otra.',
            }
        }
        return {
            icon: AlertCircle,
            color: 'text-warning',
            bgColor: 'bg-yellow-50',
            title: 'Error en el Pago',
            message: 'Ocurrió un error al procesar tu pago. Intenta nuevamente.',
        }
    }

    const config = getStatusConfig()
    const Icon = config.icon

    return (
        <div className="max-w-2xl mx-auto">
            <div className="card text-center space-y-6">
                {/* Icon */}
                <div className={`inline-flex p-4 rounded-full ${config.bgColor}`}>
                    <Icon className={`w-16 h-16 ${config.color}`} />
                </div>

                {/* Title */}
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">{config.title}</h2>
                    <p className="text-gray-600">{config.message}</p>
                </div>

                {/* Transaction Details */}
                <div className={`${config.bgColor} rounded-lg p-6 space-y-3`}>
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">Número de transacción</span>
                        <span className="text-sm font-mono font-bold text-gray-900">
                            {transaction.transactionNumber}
                        </span>
                    </div>

                    {isApproved && transaction.wompiTransactionId && (
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700">ID Wompi</span>
                            <span className="text-sm font-mono text-gray-900">
                                {transaction.wompiTransactionId}
                            </span>
                        </div>
                    )}

                    <div className="flex justify-between items-center pt-3 border-t">
                        <span className="text-lg font-medium text-gray-700">Total pagado</span>
                        <span className="text-2xl font-bold text-primary">
                            {formatCurrency(transaction.totalAmount)}
                        </span>
                    </div>
                </div>

                {/* Additional Info */}
                {isApproved && (
                    <div className="text-sm text-gray-600 bg-blue-50 rounded-lg p-4">
                        <p>
                            Recibirás un correo de confirmación a la dirección registrada.
                            <br />
                            Tiempo estimado de entrega: 3-5 días hábiles.
                        </p>
                    </div>
                )}

                {/* Actions */}
                <div className="pt-4">
                    <button onClick={onBackToProducts} className="btn-primary w-full sm:w-auto px-8">
                        <Home className="w-5 h-5 inline mr-2" />
                        Volver a Productos
                    </button>
                </div>

                {/* Timestamp */}
                <p className="text-xs text-gray-500">
                    {new Date(transaction.createdAt).toLocaleString('es-CO')}
                </p>
            </div>
        </div>
    )
}