import React from 'react'
import { ShoppingBag, CreditCard } from 'lucide-react'

interface HeaderProps {
    productsCount?: number
}

export const Header: React.FC<HeaderProps> = ({ productsCount = 0 }) => {
    return (
        <header className="bg-white shadow-sm sticky top-0 z-50 backdrop-blur-lg bg-white/90">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center shadow-lg">
                            <CreditCard className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
                                Payment Checkout
                            </h1>
                            <p className="text-xs text-gray-500">Compra segura y rápida</p>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-6">
                        <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-lg">
                            <ShoppingBag className="w-5 h-5 text-primary" />
                            <div className="text-sm">
                                <span className="font-semibold text-gray-900">{productsCount}</span>
                                <span className="text-gray-600 ml-1">productos</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-sm text-gray-600 hidden sm:inline">Seguro</span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}