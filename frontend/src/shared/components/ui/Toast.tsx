import React, { useEffect } from 'react'
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react'

type ToastType = 'success' | 'error' | 'warning'

interface ToastProps {
    type: ToastType
    message: string
    onClose: () => void
    duration?: number
}

export const Toast: React.FC<ToastProps> = ({
    type,
    message,
    onClose,
    duration = 3000,
}) => {
    useEffect(() => {
        const timer = setTimeout(onClose, duration)
        return () => clearTimeout(timer)
    }, [duration, onClose])

    const config = {
        success: {
            icon: CheckCircle,
            bgColor: 'bg-green-50',
            borderColor: 'border-green-200',
            textColor: 'text-green-800',
            iconColor: 'text-green-500',
        },
        error: {
            icon: XCircle,
            bgColor: 'bg-red-50',
            borderColor: 'border-red-200',
            textColor: 'text-red-800',
            iconColor: 'text-red-500',
        },
        warning: {
            icon: AlertCircle,
            bgColor: 'bg-yellow-50',
            borderColor: 'border-yellow-200',
            textColor: 'text-yellow-800',
            iconColor: 'text-yellow-500',
        },
    }

    const { icon: Icon, bgColor, borderColor, textColor, iconColor } = config[type]

    return (
        <div
            className={`fixed top-4 right-4 z-50 ${bgColor} ${borderColor} border rounded-lg shadow-lg p-4 flex items-center gap-3 min-w-[300px] max-w-md animate-slideDown`}
        >
            <Icon className={`w-6 h-6 ${iconColor} flex-shrink-0`} />
            <p className={`flex-1 ${textColor} font-medium`}>{message}</p>
            <button
                onClick={onClose}
                className={`${textColor} hover:opacity-70 transition-opacity`}
            >
                <X className="w-5 h-5" />
            </button>
        </div>
    )
}