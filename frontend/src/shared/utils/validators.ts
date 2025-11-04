export const validateCardNumber = (cardNumber: string): boolean => {
    const cleaned = cardNumber.replace(/\s/g, '')

    if (!/^\d{13,19}$/.test(cleaned)) {
        return false
    }

    // Luhn algorithm
    let sum = 0
    let isEven = false

    for (let i = cleaned.length - 1; i >= 0; i--) {
        let digit = parseInt(cleaned[i], 10)

        if (isEven) {
            digit *= 2
            if (digit > 9) {
                digit -= 9
            }
        }

        sum += digit
        isEven = !isEven
    }

    return sum % 10 === 0
}

export const validateExpirationDate = (date: string): boolean => {
    const match = date.match(/^(\d{2})\/(\d{2})$/)
    if (!match) return false

    const month = parseInt(match[1], 10)
    const year = parseInt('20' + match[2], 10)

    if (month < 1 || month > 12) return false

    const now = new Date()
    const expiry = new Date(year, month - 1)

    return expiry > now
}

export const validateCVV = (cvv: string): boolean => {
    return /^\d{3,4}$/.test(cvv)
}

export const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
}

export const validatePhone = (phone: string): boolean => {
    const cleaned = phone.replace(/\D/g, '')
    return cleaned.length >= 10
}