import { describe, it, expect } from 'vitest'
import {
    formatCurrency,
    formatCardNumber,
    formatExpirationDate,
    maskCardNumber,
} from '../formatters'

describe('formatters', () => {
    describe('formatCurrency', () => {
        it('should format numbers as Colombian pesos', () => {
            expect(formatCurrency(100000)).toBe('$ 100.000')
            expect(formatCurrency(1234567)).toBe('$ 1.234.567')
        })

        it('should handle zero', () => {
            expect(formatCurrency(0)).toBe('$ 0')
        })
    })

    describe('formatCardNumber', () => {
        it('should format card number with spaces', () => {
            expect(formatCardNumber('4111111111111111')).toBe('4111 1111 1111 1111')
        })

        it('should handle partial card numbers', () => {
            expect(formatCardNumber('4111')).toBe('4111')
            expect(formatCardNumber('41111111')).toBe('4111 1111')
        })
    })

    describe('formatExpirationDate', () => {
        it('should return empty string for empty input', () => {
            expect(formatExpirationDate('')).toBe('')
        })

        it('should remove non-numeric characters', () => {
            expect(formatExpirationDate('12/34')).toBe('12/34')
            expect(formatExpirationDate('12a3b')).toBe('12/3')
        })

        it('should format correctly when input has 2 digits', () => {
            expect(formatExpirationDate('12')).toBe('12/')
        })

        it('should format correctly when input has 4 digits', () => {
            expect(formatExpirationDate('1234')).toBe('12/34')
        })

        it('should truncate extra digits beyond 4', () => {
            expect(formatExpirationDate('123456')).toBe('12/34')
        })

        it('should handle spaces and symbols gracefully', () => {
            expect(formatExpirationDate('  1 2 3 4 ')).toBe('12/34')
            expect(formatExpirationDate('12-34')).toBe('12/34')
        })
    })

    describe('maskCardNumber', () => {
        it('should mask card number except last 4 digits', () => {
            expect(maskCardNumber('4111111111111111')).toBe('**** **** **** 1111')
        })

        it('should handle card numbers with spaces', () => {
            expect(maskCardNumber('4111 1111 1111 1111')).toBe('**** **** **** 1111')
        })
    })
})