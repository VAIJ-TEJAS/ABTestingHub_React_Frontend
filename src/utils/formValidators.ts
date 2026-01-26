/**
 * Comprehensive form validation utilities
 * Provides various validation functions for form inputs
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface EmailValidationOptions {
  allowEmpty?: boolean;
  domainWhitelist?: string[];
  domainBlacklist?: string[];
}

export interface PasswordValidationOptions {
  minLength?: number;
  maxLength?: number;
  requireUppercase?: boolean;
  requireLowercase?: boolean;
  requireNumbers?: boolean;
  requireSpecialChars?: boolean;
  forbiddenPatterns?: string[];
}

/**
 * Validates email address format
 */
export const validateEmail = (
  email: string,
  options: EmailValidationOptions = {}
): ValidationResult => {
  const { allowEmpty = false, domainWhitelist, domainBlacklist } = options;

  if (!email || email.trim() === '') {
    if (allowEmpty) {
      return { isValid: true };
    }
    return { isValid: false, error: 'Email is required' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Invalid email format' };
  }

  const domain = email.split('@')[1]?.toLowerCase();

  if (domainBlacklist && domainBlacklist.includes(domain)) {
    return { isValid: false, error: 'Email domain is not allowed' };
  }

  if (domainWhitelist && !domainWhitelist.includes(domain)) {
    return { isValid: false, error: 'Email domain is not in whitelist' };
  }

  return { isValid: true };
};

/**
 * Validates password strength
 */
export const validatePassword = (
  password: string,
  options: PasswordValidationOptions = {}
): ValidationResult => {
  const {
    minLength = 8,
    maxLength = 128,
    requireUppercase = true,
    requireLowercase = true,
    requireNumbers = true,
    requireSpecialChars = false,
    forbiddenPatterns = [],
  } = options;

  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }

  if (password.length < minLength) {
    return {
      isValid: false,
      error: `Password must be at least ${minLength} characters long`,
    };
  }

  if (password.length > maxLength) {
    return {
      isValid: false,
      error: `Password must be no more than ${maxLength} characters long`,
    };
  }

  if (requireUppercase && !/[A-Z]/.test(password)) {
    return {
      isValid: false,
      error: 'Password must contain at least one uppercase letter',
    };
  }

  if (requireLowercase && !/[a-z]/.test(password)) {
    return {
      isValid: false,
      error: 'Password must contain at least one lowercase letter',
    };
  }

  if (requireNumbers && !/[0-9]/.test(password)) {
    return {
      isValid: false,
      error: 'Password must contain at least one number',
    };
  }

  if (requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return {
      isValid: false,
      error: 'Password must contain at least one special character',
    };
  }

  for (const pattern of forbiddenPatterns) {
    if (password.includes(pattern)) {
      return {
        isValid: false,
        error: `Password contains forbidden pattern: ${pattern}`,
      };
    }
  }

  return { isValid: true };
};

/**
 * Validates URL format
 */
export const validateURL = (url: string, allowRelative = false): ValidationResult => {
  if (!url || url.trim() === '') {
    return { isValid: false, error: 'URL is required' };
  }

  try {
    const urlObj = new URL(url, allowRelative ? window.location.origin : undefined);
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return { isValid: false, error: 'URL must use HTTP or HTTPS protocol' };
    }
    return { isValid: true };
  } catch (error) {
    if (allowRelative && url.startsWith('/')) {
      return { isValid: true };
    }
    return { isValid: false, error: 'Invalid URL format' };
  }
};

/**
 * Validates phone number
 */
export const validatePhoneNumber = (
  phone: string,
  countryCode?: string
): ValidationResult => {
  if (!phone || phone.trim() === '') {
    return { isValid: false, error: 'Phone number is required' };
  }

  // Remove common formatting characters
  const cleaned = phone.replace(/[\s\-\(\)\.]/g, '');

  // Basic validation - 10-15 digits
  if (!/^\d{10,15}$/.test(cleaned)) {
    return { isValid: false, error: 'Phone number must be 10-15 digits' };
  }

  // Country-specific validation
  if (countryCode === 'US' && cleaned.length !== 10) {
    return { isValid: false, error: 'US phone numbers must be 10 digits' };
  }

  return { isValid: true };
};

/**
 * Validates numeric range
 */
export const validateNumberRange = (
  value: number,
  min?: number,
  max?: number
): ValidationResult => {
  if (typeof value !== 'number' || isNaN(value)) {
    return { isValid: false, error: 'Value must be a number' };
  }

  if (min !== undefined && value < min) {
    return { isValid: false, error: `Value must be at least ${min}` };
  }

  if (max !== undefined && value > max) {
    return { isValid: false, error: `Value must be at most ${max}` };
  }

  return { isValid: true };
};

/**
 * Validates required field
 */
export const validateRequired = (value: any): ValidationResult => {
  if (value === null || value === undefined) {
    return { isValid: false, error: 'This field is required' };
  }

  if (typeof value === 'string' && value.trim() === '') {
    return { isValid: false, error: 'This field is required' };
  }

  if (Array.isArray(value) && value.length === 0) {
    return { isValid: false, error: 'At least one item is required' };
  }

  return { isValid: true };
};

/**
 * Validates string length
 */
export const validateLength = (
  value: string,
  min?: number,
  max?: number
): ValidationResult => {
  if (typeof value !== 'string') {
    return { isValid: false, error: 'Value must be a string' };
  }

  const length = value.length;

  if (min !== undefined && length < min) {
    return { isValid: false, error: `Must be at least ${min} characters` };
  }

  if (max !== undefined && length > max) {
    return { isValid: false, error: `Must be no more than ${max} characters` };
  }

  return { isValid: true };
};

/**
 * Validates date range
 */
export const validateDateRange = (
  startDate: Date | string,
  endDate: Date | string
): ValidationResult => {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;

  if (isNaN(start.getTime())) {
    return { isValid: false, error: 'Invalid start date' };
  }

  if (isNaN(end.getTime())) {
    return { isValid: false, error: 'Invalid end date' };
  }

  if (start > end) {
    return { isValid: false, error: 'Start date must be before end date' };
  }

  return { isValid: true };
};

/**
 * Validates credit card number (Luhn algorithm)
 */
export const validateCreditCard = (cardNumber: string): ValidationResult => {
  if (!cardNumber || cardNumber.trim() === '') {
    return { isValid: false, error: 'Credit card number is required' };
  }

  const cleaned = cardNumber.replace(/\s/g, '');
  if (!/^\d{13,19}$/.test(cleaned)) {
    return { isValid: false, error: 'Invalid credit card number format' };
  }

  // Luhn algorithm
  let sum = 0;
  let isEven = false;

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  if (sum % 10 !== 0) {
    return { isValid: false, error: 'Invalid credit card number' };
  }

  return { isValid: true };
};

/**
 * Validates file upload
 */
export const validateFile = (
  file: File,
  options: {
    maxSize?: number; // in bytes
    allowedTypes?: string[];
    minSize?: number;
  } = {}
): ValidationResult => {
  const { maxSize = 10 * 1024 * 1024, allowedTypes, minSize = 0 } = options;

  if (!file) {
    return { isValid: false, error: 'File is required' };
  }

  if (file.size < minSize) {
    return { isValid: false, error: `File must be at least ${minSize} bytes` };
  }

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `File size must be less than ${maxSize / 1024 / 1024}MB`,
    };
  }

  if (allowedTypes && !allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `File type must be one of: ${allowedTypes.join(', ')}`,
    };
  }

  return { isValid: true };
};

/**
 * Validates JSON string
 */
export const validateJSON = (jsonString: string): ValidationResult => {
  if (!jsonString || jsonString.trim() === '') {
    return { isValid: false, error: 'JSON string is required' };
  }

  try {
    JSON.parse(jsonString);
    return { isValid: true };
  } catch (error) {
    return { isValid: false, error: 'Invalid JSON format' };
  }
};

/**
 * Validates multiple fields at once
 */
export const validateForm = (
  fields: Record<string, ValidationResult>
): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};
  let isValid = true;

  for (const [fieldName, result] of Object.entries(fields)) {
    if (!result.isValid) {
      isValid = false;
      if (result.error) {
        errors[fieldName] = result.error;
      }
    }
  }

  return { isValid, errors };
};

/**
 * Validates username format
 */
export const validateUsername = (
  username: string,
  options: { minLength?: number; maxLength?: number; allowSpecialChars?: boolean } = {}
): ValidationResult => {
  const { minLength = 3, maxLength = 30, allowSpecialChars = false } = options;

  if (!username || username.trim() === '') {
    return { isValid: false, error: 'Username is required' };
  }

  const lengthResult = validateLength(username, minLength, maxLength);
  if (!lengthResult.isValid) {
    return lengthResult;
  }

  const pattern = allowSpecialChars
    ? /^[a-zA-Z0-9_\-\.]+$/
    : /^[a-zA-Z0-9_]+$/;

  if (!pattern.test(username)) {
    return {
      isValid: false,
      error: allowSpecialChars
        ? 'Username can only contain letters, numbers, underscores, hyphens, and dots'
        : 'Username can only contain letters, numbers, and underscores',
    };
  }

  return { isValid: true };
};

