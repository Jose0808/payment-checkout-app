import React from 'react'
import { Loader2 } from 'lucide-react'

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg'
    text?: string
    fullScreen?: boolean
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'md',
    text,
    fullScreen = false,
}) => {
    const sizeClasses = {
        sm: 'w-6 h-6',
        md: 'w-10 h-10',
        lg: 'w-16 h-16',
    }

    const content = (
        <div className="flex flex-col items-center justify-center gap-4">
            <Loader2 className={`${sizeClasses[size]} text-primary animate-spin`} />
            {text && <p className="text-gray-600 text-sm">{text}</p>}
        </div>
    )

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
                {content}
            </div>
        )
    }

    return content
}
