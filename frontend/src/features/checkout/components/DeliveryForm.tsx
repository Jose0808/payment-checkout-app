import React from 'react'
import { useForm } from 'react-hook-form'
import { MapPin, ArrowLeft } from 'lucide-react'
import { DeliveryInfo } from '@shared/types'

interface DeliveryFormProps {
    onSubmit: (delivery: DeliveryInfo) => void
    onBack: () => void
}

export const DeliveryForm: React.FC<DeliveryFormProps> = ({ onSubmit, onBack }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<DeliveryInfo>({
        defaultValues: {
            country: 'Colombia',
        },
    })

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Dirección de Entrega
            </h3>

            {/* Address */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dirección Completa
                </label>
                <input
                    type="text"
                    {...register('address', {
                        required: 'Dirección es requerida',
                        minLength: { value: 5, message: 'Mínimo 5 caracteres' },
                    })}
                    className="input"
                    placeholder="Calle 123 #45-67"
                />
                {errors.address && (
                    <p className="text-error text-sm mt-1">{errors.address.message}</p>
                )}
            </div>

            {/* City and State */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
                    <input
                        type="text"
                        {...register('city', {
                            required: 'Ciudad es requerida',
                            minLength: { value: 2, message: 'Mínimo 2 caracteres' },
                        })}
                        className="input"
                        placeholder="Bogotá"
                    />
                    {errors.city && <p className="text-error text-sm mt-1">{errors.city.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Departamento
                    </label>
                    <input
                        type="text"
                        {...register('state', {
                            required: 'Departamento es requerido',
                            minLength: { value: 2, message: 'Mínimo 2 caracteres' },
                        })}
                        className="input"
                        placeholder="Cundinamarca"
                    />
                    {errors.state && <p className="text-error text-sm mt-1">{errors.state.message}</p>}
                </div>
            </div>

            {/* Zip Code and Country */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Código Postal
                    </label>
                    <input
                        type="text"
                        {...register('zipCode', {
                            required: 'Código postal es requerido',
                            minLength: { value: 3, message: 'Mínimo 3 caracteres' },
                        })}
                        className="input"
                        placeholder="110111"
                    />
                    {errors.zipCode && (
                        <p className="text-error text-sm mt-1">{errors.zipCode.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">País</label>
                    <input
                        type="text"
                        {...register('country', { required: 'País es requerido' })}
                        className="input"
                        placeholder="Colombia"
                    />
                    {errors.country && (
                        <p className="text-error text-sm mt-1">{errors.country.message}</p>
                    )}
                </div>
            </div>

            {/* Notes */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notas (Opcional)
                </label>
                <textarea
                    {...register('notes')}
                    className="input resize-none"
                    rows={3}
                    placeholder="Ej: Llamar antes de entregar"
                />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
                <button type="button" onClick={onBack} className="btn-secondary flex-1">
                    <ArrowLeft className="w-4 h-4 mr-2 inline" />
                    Volver
                </button>
                <button type="submit" className="btn-primary flex-1">
                    Ver Resumen
                </button>
            </div>
        </form>
    )
}