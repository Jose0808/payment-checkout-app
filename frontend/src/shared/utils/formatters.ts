export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
    }).format(amount)
        .replace(/\u00A0/g, ' ');
}

export const formatCardNumber = (value: string): string => {
    const cleaned = value.replace(/\s/g, '')
    const groups = cleaned.match(/.{1,4}/g) || []
    return groups.join(' ')
}

export const formatExpirationDate = (value: string): string => {
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length >= 2) {
        return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`
    }
    return cleaned
}

export const maskCardNumber = (cardNumber: string): string => {
    const cleaned = cardNumber.replace(/\s/g, '')
    if (cleaned.length < 4) return cardNumber

    const lastFour = cleaned.slice(-4)
    const masked = '*'.repeat(cleaned.length - 4)
    return formatCardNumber(masked + lastFour)
}