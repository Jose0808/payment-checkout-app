import { describe, it, expect } from 'vitest'
import {
    validateCardNumber,
    validateExpirationDate,
    validateCVV,
    validateEmail,
    validatePhone,
} from '../validators'

describe('validators', () => {
    describe('validateCardNumber', () => {
        it('should validate correct card numbers', () => {
            expect(validateCardNumber('4111111111111111')).toBe(true) // Visa
            expect(validateCardNumber('5555555555554444')).toBe(true) // Mastercard
        })

        it('should invalidate incorrect card numbers', () => {
            expect(validateCardNumber('1234567890123456')).toBe(false)
            expect(validateCardNumber('411111111111111')).toBe(false) // Too short
            expect(validateCardNumber('41111111111111111')).toBe(false) // Invalid checksum
        })

        it('should handle card numbers with spaces', () => {
            expect(validateCardNumber('4111 1111 1111 1111')).toBe(true)
        })
    })

    describe('validateExpirationDate', () => {
        it('should validate future dates', () => {
            expect(validateExpirationDate('12/30')).toBe(true)
        })

        it('should invalidate past dates', () => {
            expect(validateExpirationDate('01/20')).toBe(false)
        })

        it('should invalidate invalid months', () => {
            expect(validateExpirationDate('13/25')).toBe(false)
            expect(validateExpirationDate('00/25')).toBe(false)
        })

        it('should invalidate invalid formats', () => {
            expect(validateExpirationDate('1225')).toBe(false)
            expect(validateExpirationDate('12-25')).toBe(false)
        })
    })

    describe('validateCVV', () => {
        it('should validate 3-digit CVV', () => {
            expect(validateCVV('123')).toBe(true)
        })

        it('should validate 4-digit CVV', () => {
            expect(validateCVV('1234')).toBe(true)
        })

        it('should invalidate invalid CVV', () => {
            expect(validateCVV('12')).toBe(false)
            expect(validateCVV('12345')).toBe(false)
            expect(validateCVV('abc')).toBe(false)
        })
    })

    describe('validateEmail', () => {
        it('should validate correct emails', () => {
            expect(validateEmail('test@example.com')).toBe(true)
            expect(validateEmail('user+tag@domain.co')).toBe(true)
        })

        it('should invalidate incorrect emails', () => {
            expect(validateEmail('invalid')).toBe(false)
            expect(validateEmail('@example.com')).toBe(false)
            expect(validateEmail('test@')).toBe(false)
        })
    })

    describe('validatePhone', () => {
        it('should validate correct phone numbers', () => {
            expect(validatePhone('+573001234567')).toBe(true)
            expect(validatePhone('3001234567')).toBe(true)
            expect(validatePhone('(300) 123-4567')).toBe(true)
        })

        it('should invalidate too short phone numbers', () => {
            expect(validatePhone('12345')).toBe(false)
        })
    })
})