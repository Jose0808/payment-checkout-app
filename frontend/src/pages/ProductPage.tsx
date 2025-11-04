import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import {
    fetchProducts,
    selectProduct,
    updateProductStock,
} from '@features/product/productSlice'
import {
    openPaymentModal,
    closePaymentModal,
    setCustomerInfo,
    setCardInfo,
    setDeliveryInfo,
    openSummary,
    closeSummary,
    resetCheckout,
} from '@features/checkout/checkoutSlice'
import {
    createTransaction,
    processPayment,
    clearPayment,
} from '@features/payment/paymentSlice'
import { setLastTransaction } from '@features/transaction/transactionSlice'
import { ProductCard } from '@features/product/components/ProductCard'
import { ProductSkeleton } from '@features/product/components/ProductSkeleton'
import { PaymentModal } from '@features/checkout/components/PaymentModal'
import { BackdropSummary } from '@features/payment/components/BackdropSummary'
import { TransactionResult } from '@features/transaction/components/TransactionResult'
import { Header } from '@shared/components/layout/Header'
import { LoadingSpinner } from '@shared/components/ui/Spinner'
import { Product, Customer, CardInfo, DeliveryInfo, TransactionStatus } from '@shared/types'
import {
    ShoppingBag,
    Sparkles,
    Shield,
    Truck,
    CreditCard,
    AlertCircle
} from 'lucide-react'

export const ProductPage: React.FC = () => {
    const dispatch = useAppDispatch()

    const { products, selectedProduct, loading, error } = useAppSelector(
        state => state.product
    )
    const { isModalOpen, isSummaryOpen, customer, cardInfo, deliveryInfo } =
        useAppSelector(state => state.checkout)
    const { currentTransaction, processing, fees } = useAppSelector(state => state.payment)
    const { lastTransaction } = useAppSelector(state => state.transaction)

    const [showResult, setShowResult] = useState(false)

    useEffect(() => {
        dispatch(fetchProducts())
    }, [dispatch])

    useEffect(() => {
        if (lastTransaction && lastTransaction.status !== TransactionStatus.PENDING) {
            setShowResult(true)
        }
    }, [lastTransaction])

    const handleBuyClick = (product: Product) => {
        dispatch(selectProduct(product))
        dispatch(openPaymentModal())
    }

    const handleModalClose = () => {
        dispatch(closePaymentModal())
    }

    const handlePaymentInfoSubmit = async (
        customerData: Customer,
        card: CardInfo,
        delivery: DeliveryInfo
    ) => {
        if (!selectedProduct) return

        dispatch(setCustomerInfo(customerData))
        dispatch(setCardInfo(card))
        dispatch(setDeliveryInfo(delivery))

        const result = await dispatch(
            createTransaction({
                productId: selectedProduct.id,
                customer: customerData,
            })
        )

        if (createTransaction.fulfilled.match(result)) {
            dispatch(closePaymentModal())
            dispatch(openSummary())
        }
    }

    const handleConfirmPayment = async () => {
        if (!currentTransaction || !cardInfo || !deliveryInfo) return

        const result = await dispatch(
            processPayment({
                transactionId: currentTransaction.id,
                card: cardInfo,
                delivery: deliveryInfo,
            })
        )

        if (processPayment.fulfilled.match(result)) {
            const transaction = result.payload
            dispatch(setLastTransaction(transaction))
            dispatch(closeSummary())

            if (transaction.status === TransactionStatus.APPROVED && selectedProduct) {
                dispatch(
                    updateProductStock({
                        productId: selectedProduct.id,
                        newStock: selectedProduct.stock - 1,
                    })
                )
            }

            setShowResult(true)
        }
    }

    const handleBackToProducts = () => {
        setShowResult(false)
        dispatch(resetCheckout())
        dispatch(clearPayment())
        dispatch(fetchProducts())
    }

    const handleSummaryClose = () => {
        dispatch(closeSummary())
    }

    if (showResult && lastTransaction) {
        return (
            <div className="min-h-screen">
                <Header productsCount={products.length} />
                <div className="py-12 px-4">
                    <TransactionResult
                        transaction={lastTransaction}
                        onBackToProducts={handleBackToProducts}
                    />
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen">
            {/* Header */}
            <Header productsCount={products.length} />

            {/* Hero Section */}
            <section className="relative overflow-hidden py-16 px-4">
                {/* Animated Background */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" />
                    <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }} />
                    <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '4s' }} />
                </div>

                <div className="container-custom">
                    <div className="max-w-4xl mx-auto text-center space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm font-semibold text-primary animate-fadeIn">
                            <Sparkles className="w-4 h-4" />
                            Checkout Seguro y Rápido
                        </div>

                        <h1 className="text-4xl md:text-6xl font-black text-gradient animate-fadeIn">
                            Compra lo que Amas,
                            <br />
                            Paga con Confianza
                        </h1>

                        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto animate-fadeIn">
                            Procesamiento instantáneo de pagos con las mejores medidas de seguridad
                        </p>

                        {/* Features */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto pt-8">
                            <div className="card-gradient p-6 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
                                <Shield className="w-8 h-8 text-primary mx-auto mb-3" />
                                <h3 className="font-semibold text-gray-900 mb-1">100% Seguro</h3>
                                <p className="text-sm text-gray-600">Encriptación SSL</p>
                            </div>

                            <div className="card-gradient p-6 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                                <Truck className="w-8 h-8 text-primary mx-auto mb-3" />
                                <h3 className="font-semibold text-gray-900 mb-1">Envío Incluido</h3>
                                <p className="text-sm text-gray-600">A todo el país</p>
                            </div>

                            <div className="card-gradient p-6 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
                                <CreditCard className="w-8 h-8 text-primary mx-auto mb-3" />
                                <h3 className="font-semibold text-gray-900 mb-1">Pago Fácil</h3>
                                <p className="text-sm text-gray-600">Visa & Mastercard</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Products Section */}
            <section className="section">
                <div className="container-custom">
                    {/* Section Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                                <ShoppingBag className="w-8 h-8 text-primary" />
                                Productos Destacados
                            </h2>
                            <p className="text-gray-600 mt-2">Selecciona tu producto favorito</p>
                        </div>

                        {!loading && products.length > 0 && (
                            <div className="badge-info">
                                {products.filter(p => p.stock > 0).length} disponibles
                            </div>
                        )}
                    </div>

                    {/* Error State */}
                    {error && (
                        <div className="card bg-red-50 border-2 border-red-200 mb-8 animate-fadeIn">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="font-semibold text-red-900 mb-1">Error al cargar productos</h3>
                                    <p className="text-red-700 text-sm">{error}</p>
                                    <button
                                        onClick={() => dispatch(fetchProducts())}
                                        className="btn-outline mt-3"
                                    >
                                        Reintentar
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Loading State */}
                    {loading && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <ProductSkeleton />
                            <ProductSkeleton />
                            <ProductSkeleton />
                        </div>
                    )}

                    {/* Products Grid */}
                    {!loading && products.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {products.map((product, index) => (
                                <div
                                    key={product.id}
                                    className="animate-fadeIn"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <ProductCard product={product} onBuyClick={handleBuyClick} />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && products.length === 0 && (
                        <div className="card text-center py-16">
                            <ShoppingBag className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                No hay productos disponibles
                            </h3>
                            <p className="text-gray-600">
                                Vuelve más tarde para ver nuestros productos
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* Trust Badges */}
            <section className="py-12 bg-white/50">
                <div className="container-custom">
                    <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
                        <img src="/visa-logo.svg" alt="Visa" className="h-8 grayscale" />
                        <img src="/mastercard-logo.svg" alt="Mastercard" className="h-8 grayscale" />
                        <div className="text-sm font-semibold text-gray-500">SSL Seguro</div>
                        <div className="text-sm font-semibold text-gray-500">PCI Compliant</div>
                    </div>
                </div>
            </section>

            {/* Modals */}
            <PaymentModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onSubmit={handlePaymentInfoSubmit}
            />

            {isSummaryOpen && selectedProduct && customer && deliveryInfo && cardInfo && (
                <BackdropSummary
                    isOpen={isSummaryOpen}
                    product={selectedProduct}
                    customer={customer}
                    delivery={deliveryInfo}
                    cardLast4={cardInfo.cardNumber.slice(-4)}
                    baseFee={fees.baseFee}
                    deliveryFee={fees.deliveryFee}
                    onConfirm={handleConfirmPayment}
                    onClose={handleSummaryClose}
                    processing={processing}
                />
            )}

            {/* Processing Overlay */}
            {processing && (
                <LoadingSpinner
                    size="lg"
                    text="Procesando tu pago..."
                    fullScreen
                />
            )}
        </div>
    )
}