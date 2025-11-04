import { describe, it, expect } from 'vitest'
import { detectCardType, getCardIcon, getCardColor } from '../cardDetector'
import { CardType } from '@shared/types'

describe('cardDetector', () => {
    describe('detectCardType', () => {
        it('should detect Visa', () => {
            expect(detectCardType('4111111111111111')).toBe(CardType.VISA)
            expect(detectCardType('4')).toBe(CardType.VISA)
        })

        it('should detect Mastercard', () => {
            expect(detectCardType('5555555555554444')).toBe(CardType.MASTERCARD)
            expect(detectCardType('51')).toBe(CardType.MASTERCARD)
            expect(detectCardType('2221')).toBe(CardType.MASTERCARD)
        })

        it('should detect American Express', () => {
            expect(detectCardType('341111111111111')).toBe(CardType.AMEX)
            expect(detectCardType('37')).toBe(CardType.AMEX)
        })

        it('should detect Discover', () => {
            expect(detectCardType('6011 1111 1111 1111')).toBe(CardType.DISCOVER)
            expect(detectCardType('6512345678901234')).toBe(CardType.DISCOVER)
        })

        it('should return UNKNOWN for invalid or unrecognized cards', () => {
            expect(detectCardType('1234567890123456')).toBe(CardType.UNKNOWN)
            expect(detectCardType('')).toBe(CardType.UNKNOWN)
        })

        it('should handle numbers with spaces', () => {
            expect(detectCardType('4111 1111 1111 1111')).toBe(CardType.VISA)
        })
    })

    describe('getCardIcon', () => {
        it('should return correct icon for each card type', () => {
            expect(getCardIcon(CardType.VISA)).toBe('💳 Visa')
            expect(getCardIcon(CardType.MASTERCARD)).toBe('💳 Mastercard')
            expect(getCardIcon(CardType.AMEX)).toBe('💳 American Express')
            expect(getCardIcon(CardType.DISCOVER)).toBe('💳 Discover')
        })

        it('should return default icon for unknown type', () => {
            expect(getCardIcon(CardType.UNKNOWN)).toBe('💳')
        })
    })

    describe('getCardColor', () => {
        it('should return correct color for each card type', () => {
            expect(getCardColor(CardType.VISA)).toBe('#1A1F71')
            expect(getCardColor(CardType.MASTERCARD)).toBe('#EB001B')
            expect(getCardColor(CardType.AMEX)).toBe('#006FCF')
            expect(getCardColor(CardType.DISCOVER)).toBe('#FF6000')
        })

        it('should return default gray color for unknown type', () => {
            expect(getCardColor(CardType.UNKNOWN)).toBe('#6B7280')
        })
    })
})
