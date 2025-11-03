import React from 'react'
import { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
    icon: LucideIcon
    title: string
    description: string
    action?: {
        label: string
        onClick: () => void
    }
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    icon: Icon,
    title,
    description,
    action,
}) => {
    return (
        <div className="card text-center py-16 animate-fadeIn">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
                <Icon className="w-10 h-10 text-gray-400" />
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">{description}</p>

            {action && (
                <button onClick={action.onClick} className="btn-primary">
                    {action.label}
                </button>
            )}
        </div>
    )
}