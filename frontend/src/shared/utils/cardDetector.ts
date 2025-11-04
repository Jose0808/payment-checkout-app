import { CardType } from '@shared/types'

export const detectCardType = (cardNumber: string): CardType => {
    const cleaned = cardNumber.replace(/\s/g, '')

    // Visa: starts with 4
    if (/^4/.test(cleaned)) {
        return CardType.VISA
    }

    // Mastercard: starts with 51-55 or 2221-2720
    if (/^5[1-5]/.test(cleaned) || /^2(22[1-9]|2[3-9]\d|[3-6]\d{2}|7[01]\d|720)/.test(cleaned)) {
        return CardType.MASTERCARD
    }

    // American Express: starts with 34 or 37
    if (/^3[47]/.test(cleaned)) {
        return CardType.AMEX
    }

    // Discover: starts with 6011, 622126-622925, 644-649, or 65
    if (/^6011|^64[4-9]|^65|^622(12[6-9]|1[3-9]\d|[2-8]\d{2}|9[01]\d|92[0-5])/.test(cleaned)) {
        return CardType.DISCOVER
    }

    return CardType.UNKNOWN
}

export const getCardIcon = (cardType: CardType): string => {
    switch (cardType) {
        case CardType.VISA:
            return '💳 Visa'
        case CardType.MASTERCARD:
            return '💳 Mastercard'
        case CardType.AMEX:
            return '💳 American Express'
        case CardType.DISCOVER:
            return '💳 Discover'
        default:
            return '💳'
    }
}

export const getCardColor = (cardType: CardType): string => {
    switch (cardType) {
        case CardType.VISA:
            return '#1A1F71' // Visa Blue
        case CardType.MASTERCARD:
            return '#EB001B' // Mastercard Red
        case CardType.AMEX:
            return '#006FCF' // Amex Blue
        case CardType.DISCOVER:
            return '#FF6000' // Discover Orange
        default:
            return '#6B7280' // Gray
    }
}