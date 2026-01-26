import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import {
  validateEmail,
  validatePassword,
  validateURL,
  validatePhoneNumber,
  validateNumberRange,
  validateRequired,
  validateLength,
  validateDateRange,
  validateCreditCard,
  validateFile,
  validateJSON,
  validateForm,
  validateUsername,
  type ValidationResult,
  type EmailValidationOptions,
  type PasswordValidationOptions,
} from '../formValidators'

describe('formValidators', () => {
  beforeEach(() => {
    // Setup
  })

  afterEach(() => {
    // Cleanup
  })

  describe('validateEmail', () => {
    it('validates correct email format', () => {
      const result = validateEmail('test@example.com')
      expect(result.isValid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('rejects invalid email format', () => {
      const result = validateEmail('invalid-email')
      expect(result.isValid).toBe(false)
      expect(result.error).toBeDefined()
    })

    it('rejects empty email when allowEmpty is false', () => {
      const result = validateEmail('')
      expect(result.isValid).toBe(false)
    })

    it('allows empty email when allowEmpty is true', () => {
      const options: EmailValidationOptions = { allowEmpty: true }
      const result = validateEmail('', options)
      expect(result.isValid).toBe(true)
    })

    it('rejects email with blacklisted domain', () => {
      const options: EmailValidationOptions = {
        domainBlacklist: ['spam.com'],
      }
      const result = validateEmail('test@spam.com', options)
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('not allowed')
    })

    it('accepts email with whitelisted domain', () => {
      const options: EmailValidationOptions = {
        domainWhitelist: ['example.com'],
      }
      const result = validateEmail('test@example.com', options)
      expect(result.isValid).toBe(true)
    })

    it('rejects email not in whitelist', () => {
      const options: EmailValidationOptions = {
        domainWhitelist: ['example.com'],
      }
      const result = validateEmail('test@other.com', options)
      expect(result.isValid).toBe(false)
    })

    it('handles email with subdomain', () => {
      const result = validateEmail('test@mail.example.com')
      expect(result.isValid).toBe(true)
    })

    it('handles email with plus sign', () => {
      const result = validateEmail('test+tag@example.com')
      expect(result.isValid).toBe(true)
    })

    it('handles email with multiple dots', () => {
      const result = validateEmail('test.name@example.co.uk')
      expect(result.isValid).toBe(true)
    })
  })

  describe('validatePassword', () => {
    it('validates password meeting all requirements', () => {
      const options: PasswordValidationOptions = {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
      }
      const result = validatePassword('Password123', options)
      expect(result.isValid).toBe(true)
    })

    it('rejects password too short', () => {
      const options: PasswordValidationOptions = { minLength: 8 }
      const result = validatePassword('Short1', options)
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('at least')
    })

    it('rejects password too long', () => {
      const options: PasswordValidationOptions = { maxLength: 10 }
      const result = validatePassword('VeryLongPassword123', options)
      expect(result.isValid).toBe(false)
    })

    it('rejects password without uppercase', () => {
      const options: PasswordValidationOptions = { requireUppercase: true }
      const result = validatePassword('password123', options)
      expect(result.isValid).toBe(false)
    })

    it('rejects password without lowercase', () => {
      const options: PasswordValidationOptions = { requireLowercase: true }
      const result = validatePassword('PASSWORD123', options)
      expect(result.isValid).toBe(false)
    })

    it('rejects password without numbers', () => {
      const options: PasswordValidationOptions = { requireNumbers: true }
      const result = validatePassword('Password', options)
      expect(result.isValid).toBe(false)
    })

    it('rejects password without special characters when required', () => {
      const options: PasswordValidationOptions = { requireSpecialChars: true }
      const result = validatePassword('Password123', options)
      expect(result.isValid).toBe(false)
    })

    it('rejects password with forbidden pattern', () => {
      const options: PasswordValidationOptions = {
        forbiddenPatterns: ['1234'],
      }
      const result = validatePassword('Password1234', options)
      expect(result.isValid).toBe(false)
    })

    it('rejects empty password', () => {
      const result = validatePassword('')
      expect(result.isValid).toBe(false)
    })

    it('handles password with all special characters', () => {
      const options: PasswordValidationOptions = { requireSpecialChars: true }
      const result = validatePassword('Password123!@#', options)
      expect(result.isValid).toBe(true)
    })
  })

  describe('validateURL', () => {
    it('validates correct HTTP URL', () => {
      const result = validateURL('http://example.com')
      expect(result.isValid).toBe(true)
    })

    it('validates correct HTTPS URL', () => {
      const result = validateURL('https://example.com')
      expect(result.isValid).toBe(true)
    })

    it('rejects invalid URL format', () => {
      const result = validateURL('not-a-url')
      expect(result.isValid).toBe(false)
    })

    it('rejects empty URL', () => {
      const result = validateURL('')
      expect(result.isValid).toBe(false)
    })

    it('allows relative URL when allowRelative is true', () => {
      const result = validateURL('/path/to/page', true)
      expect(result.isValid).toBe(true)
    })

    it('rejects relative URL when allowRelative is false', () => {
      const result = validateURL('/path/to/page', false)
      expect(result.isValid).toBe(false)
    })

    it('rejects URL with invalid protocol', () => {
      const result = validateURL('ftp://example.com')
      expect(result.isValid).toBe(false)
    })

    it('handles URL with query parameters', () => {
      const result = validateURL('https://example.com?param=value')
      expect(result.isValid).toBe(true)
    })

    it('handles URL with hash', () => {
      const result = validateURL('https://example.com#section')
      expect(result.isValid).toBe(true)
    })
  })

  describe('validatePhoneNumber', () => {
    it('validates correct phone number', () => {
      const result = validatePhoneNumber('1234567890')
      expect(result.isValid).toBe(true)
    })

    it('rejects phone number too short', () => {
      const result = validatePhoneNumber('123')
      expect(result.isValid).toBe(false)
    })

    it('rejects phone number too long', () => {
      const result = validatePhoneNumber('1234567890123456')
      expect(result.isValid).toBe(false)
    })

    it('handles phone number with formatting', () => {
      const result = validatePhoneNumber('(123) 456-7890')
      expect(result.isValid).toBe(true)
    })

    it('validates US phone number format', () => {
      const result = validatePhoneNumber('1234567890', 'US')
      expect(result.isValid).toBe(true)
    })

    it('rejects US phone number with wrong length', () => {
      const result = validatePhoneNumber('123456789', 'US')
      expect(result.isValid).toBe(false)
    })

    it('rejects empty phone number', () => {
      const result = validatePhoneNumber('')
      expect(result.isValid).toBe(false)
    })

    it('handles phone number with spaces and dashes', () => {
      const result = validatePhoneNumber('1-234-567-8901')
      expect(result.isValid).toBe(true)
    })
  })

  describe('validateNumberRange', () => {
    it('validates number within range', () => {
      const result = validateNumberRange(5, 1, 10)
      expect(result.isValid).toBe(true)
    })

    it('rejects number below minimum', () => {
      const result = validateNumberRange(0, 1, 10)
      expect(result.isValid).toBe(false)
    })

    it('rejects number above maximum', () => {
      const result = validateNumberRange(11, 1, 10)
      expect(result.isValid).toBe(false)
    })

    it('validates number with only minimum', () => {
      const result = validateNumberRange(5, 1)
      expect(result.isValid).toBe(true)
    })

    it('validates number with only maximum', () => {
      const result = validateNumberRange(5, undefined, 10)
      expect(result.isValid).toBe(true)
    })

    it('rejects NaN', () => {
      const result = validateNumberRange(NaN)
      expect(result.isValid).toBe(false)
    })

    it('rejects non-number type', () => {
      const result = validateNumberRange('5' as any)
      expect(result.isValid).toBe(false)
    })
  })

  describe('validateRequired', () => {
    it('validates non-empty string', () => {
      const result = validateRequired('value')
      expect(result.isValid).toBe(true)
    })

    it('rejects null', () => {
      const result = validateRequired(null)
      expect(result.isValid).toBe(false)
    })

    it('rejects undefined', () => {
      const result = validateRequired(undefined)
      expect(result.isValid).toBe(false)
    })

    it('rejects empty string', () => {
      const result = validateRequired('')
      expect(result.isValid).toBe(false)
    })

    it('rejects whitespace-only string', () => {
      const result = validateRequired('   ')
      expect(result.isValid).toBe(false)
    })

    it('validates non-empty array', () => {
      const result = validateRequired([1, 2, 3])
      expect(result.isValid).toBe(true)
    })

    it('rejects empty array', () => {
      const result = validateRequired([])
      expect(result.isValid).toBe(false)
    })

    it('validates number zero', () => {
      const result = validateRequired(0)
      expect(result.isValid).toBe(true)
    })

    it('validates boolean false', () => {
      const result = validateRequired(false)
      expect(result.isValid).toBe(true)
    })
  })

  describe('validateLength', () => {
    it('validates string within length range', () => {
      const result = validateLength('test', 1, 10)
      expect(result.isValid).toBe(true)
    })

    it('rejects string too short', () => {
      const result = validateLength('ab', 3, 10)
      expect(result.isValid).toBe(false)
    })

    it('rejects string too long', () => {
      const result = validateLength('very long string', 1, 5)
      expect(result.isValid).toBe(false)
    })

    it('validates string with only minimum', () => {
      const result = validateLength('test', 3)
      expect(result.isValid).toBe(true)
    })

    it('validates string with only maximum', () => {
      const result = validateLength('test', undefined, 10)
      expect(result.isValid).toBe(true)
    })

    it('rejects non-string type', () => {
      const result = validateLength(123 as any)
      expect(result.isValid).toBe(false)
    })
  })

  describe('validateDateRange', () => {
    it('validates correct date range', () => {
      const start = new Date('2024-01-01')
      const end = new Date('2024-12-31')
      const result = validateDateRange(start, end)
      expect(result.isValid).toBe(true)
    })

    it('rejects invalid start date', () => {
      const start = new Date('invalid')
      const end = new Date('2024-12-31')
      const result = validateDateRange(start, end)
      expect(result.isValid).toBe(false)
    })

    it('rejects invalid end date', () => {
      const start = new Date('2024-01-01')
      const end = new Date('invalid')
      const result = validateDateRange(start, end)
      expect(result.isValid).toBe(false)
    })

    it('rejects end date before start date', () => {
      const start = new Date('2024-12-31')
      const end = new Date('2024-01-01')
      const result = validateDateRange(start, end)
      expect(result.isValid).toBe(false)
    })

    it('handles date strings', () => {
      const result = validateDateRange('2024-01-01', '2024-12-31')
      expect(result.isValid).toBe(true)
    })
  })

  describe('validateCreditCard', () => {
    it('validates correct credit card number (Luhn algorithm)', () => {
      const result = validateCreditCard('4532015112830366')
      expect(result.isValid).toBe(true)
    })

    it('rejects invalid credit card number', () => {
      const result = validateCreditCard('1234567890123456')
      expect(result.isValid).toBe(false)
    })

    it('rejects credit card number too short', () => {
      const result = validateCreditCard('123456789012')
      expect(result.isValid).toBe(false)
    })

    it('rejects credit card number too long', () => {
      const result = validateCreditCard('12345678901234567890')
      expect(result.isValid).toBe(false)
    })

    it('rejects empty credit card number', () => {
      const result = validateCreditCard('')
      expect(result.isValid).toBe(false)
    })

    it('handles credit card with spaces', () => {
      const result = validateCreditCard('4532 0151 1283 0366')
      expect(result.isValid).toBe(true)
    })
  })

  describe('validateFile', () => {
    it('validates file within size limits', () => {
      const file = new File(['content'], 'test.txt', { type: 'text/plain' })
      Object.defineProperty(file, 'size', { value: 1024 })
      const result = validateFile(file, { maxSize: 2048 })
      expect(result.isValid).toBe(true)
    })

    it('rejects file too large', () => {
      const file = new File(['content'], 'test.txt', { type: 'text/plain' })
      Object.defineProperty(file, 'size', { value: 2048 })
      const result = validateFile(file, { maxSize: 1024 })
      expect(result.isValid).toBe(false)
    })

    it('rejects file too small', () => {
      const file = new File(['content'], 'test.txt', { type: 'text/plain' })
      Object.defineProperty(file, 'size', { value: 100 })
      const result = validateFile(file, { minSize: 200 })
      expect(result.isValid).toBe(false)
    })

    it('validates file with allowed type', () => {
      const file = new File(['content'], 'test.txt', { type: 'text/plain' })
      const result = validateFile(file, { allowedTypes: ['text/plain'] })
      expect(result.isValid).toBe(true)
    })

    it('rejects file with disallowed type', () => {
      const file = new File(['content'], 'test.txt', { type: 'text/plain' })
      const result = validateFile(file, { allowedTypes: ['image/png'] })
      expect(result.isValid).toBe(false)
    })

    it('rejects null file', () => {
      const result = validateFile(null as any)
      expect(result.isValid).toBe(false)
    })
  })

  describe('validateJSON', () => {
    it('validates correct JSON string', () => {
      const result = validateJSON('{"key": "value"}')
      expect(result.isValid).toBe(true)
    })

    it('rejects invalid JSON string', () => {
      const result = validateJSON('{key: value}')
      expect(result.isValid).toBe(false)
    })

    it('rejects empty JSON string', () => {
      const result = validateJSON('')
      expect(result.isValid).toBe(false)
    })

    it('validates JSON array', () => {
      const result = validateJSON('[1, 2, 3]')
      expect(result.isValid).toBe(true)
    })
  })

  describe('validateForm', () => {
    it('validates form with all valid fields', () => {
      const fields = {
        email: { isValid: true },
        password: { isValid: true },
      }
      const result = validateForm(fields)
      expect(result.isValid).toBe(true)
      expect(Object.keys(result.errors)).toHaveLength(0)
    })

    it('returns errors for invalid fields', () => {
      const fields = {
        email: { isValid: false, error: 'Invalid email' },
        password: { isValid: true },
      }
      const result = validateForm(fields)
      expect(result.isValid).toBe(false)
      expect(result.errors.email).toBe('Invalid email')
    })

    it('handles multiple validation errors', () => {
      const fields = {
        email: { isValid: false, error: 'Invalid email' },
        password: { isValid: false, error: 'Password too short' },
      }
      const result = validateForm(fields)
      expect(result.isValid).toBe(false)
      expect(Object.keys(result.errors)).toHaveLength(2)
    })
  })

  describe('validateUsername', () => {
    it('validates correct username', () => {
      const result = validateUsername('testuser123')
      expect(result.isValid).toBe(true)
    })

    it('rejects username too short', () => {
      const result = validateUsername('ab', { minLength: 3 })
      expect(result.isValid).toBe(false)
    })

    it('rejects username too long', () => {
      const result = validateUsername('a'.repeat(31), { maxLength: 30 })
      expect(result.isValid).toBe(false)
    })

    it('rejects username with special chars when not allowed', () => {
      const result = validateUsername('test@user', { allowSpecialChars: false })
      expect(result.isValid).toBe(false)
    })

    it('allows username with special chars when allowed', () => {
      const result = validateUsername('test-user', { allowSpecialChars: true })
      expect(result.isValid).toBe(true)
    })

    it('rejects empty username', () => {
      const result = validateUsername('')
      expect(result.isValid).toBe(false)
    })
  })
})

