import React from 'react'
import { Product } from '@shared/types'
import { formatCurrency } from '@shared/utils/formatters'
import { ShoppingCart, Package, Check, TrendingUp } from 'lucide-react'

interface ProductCardProps {
    product: Product
    onBuyClick: (product: Product) => void
}

export const ProductCard: React.FC<ProductCardProps> = ({
    product,
    onBuyClick,
}) => {
    const isOutOfStock = product.stock === 0
    const isLowStock = product.stock > 0 && product.stock <= 5

    return (
        <div className="group relative">
            {/* Card Container */}
            <div className="card hover:shadow-2xl transition-all duration-300 overflow-hidden animate-fadeIn">
                {/* Image Container with Overlay */}
                <div className="relative w-full h-72 mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden">
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                    />

                    {/* Overlay Effects */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Stock Badge */}
                    {isLowStock && !isOutOfStock && (
                        <div className="absolute top-4 right-4 px-3 py-1 bg-warning text-white text-xs font-semibold rounded-full flex items-center gap-1 animate-pulse">
                            <TrendingUp className="w-3 h-3" />
                            ¡Solo {product.stock} disponibles!
                        </div>
                    )}

                    {isOutOfStock && (
                        <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center backdrop-blur-sm">
                            <span className="text-white font-bold text-2xl px-6 py-3 border-2 border-white rounded-lg">
                                AGOTADO
                            </span>
                        </div>
                    )}

                    {/* Quick View Button (appears on hover) */}
                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                        <button
                            onClick={() => !isOutOfStock && onBuyClick(product)}
                            disabled={isOutOfStock}
                            className="w-full btn-primary py-3 backdrop-blur-md bg-white/90 text-gray-900 hover:bg-white font-semibold disabled:opacity-50"
                        >
                            <ShoppingCart className="w-5 h-5 inline mr-2" />
                            Vista Rápida
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-4">
                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-primary transition-colors">
                        {product.name}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                        {product.description}
                    </p>

                    {/* Features List */}
                    <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            Envío incluido
                        </span>
                        <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full flex items-center gap-1">
                            <Package className="w-3 h-3" />
                            Garantía 30 días
                        </span>
                    </div>

                    {/* Stock Indicator */}
                    <div className="flex items-center gap-2 text-sm">
                        <div
                            className={`w-2 h-2 rounded-full ${isOutOfStock
                                ? 'bg-error'
                                : isLowStock
                                    ? 'bg-warning animate-pulse'
                                    : 'bg-success'
                                }`}
                        />
                        <span
                            className={`font-medium ${isOutOfStock
                                ? 'text-error'
                                : isLowStock
                                    ? 'text-warning'
                                    : 'text-success'
                                }`}
                        >
                            {isOutOfStock
                                ? 'Sin stock'
                                : isLowStock
                                    ? `Últimas ${product.stock} unidades`
                                    : `${product.stock} disponibles`}
                        </span>
                    </div>

                    {/* Price and Action */}
                    <div className="pt-4 border-t border-gray-100">
                        <div className="flex items-end justify-between mb-4">
                            <div>
                                <span className="text-sm text-gray-500 line-through">
                                    {formatCurrency(product.price * 1.2)}
                                </span>
                                <div className="text-3xl font-bold text-primary">
                                    {formatCurrency(product.price)}
                                </div>
                                <span className="text-xs text-green-600 font-semibold">
                                    Ahorra 20%
                                </span>
                            </div>
                        </div>

                        {/* Buy Button */}
                        <button
                            onClick={() => onBuyClick(product)}
                            disabled={isOutOfStock}
                            className={`w-full btn flex items-center justify-center gap-2 ${isOutOfStock
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'btn-primary shadow-lg hover:shadow-xl'
                                }`}
                        >
                            <ShoppingCart className="w-5 h-5" />
                            {isOutOfStock ? 'No disponible' : 'Pay with credit card'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}