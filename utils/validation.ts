// utils/validation.ts

export interface ValidationResult {
  isValid: boolean
  error?: string
}

export interface ValidationRules {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: string) => boolean
}

// Generic validation function
export const validateField = (value: string, rules: ValidationRules, fieldName: string): ValidationResult => {
  if (rules.required && !value.trim()) {
    return { isValid: false, error: `${fieldName} is required` }
  }

  if (value.trim() && rules.minLength && value.length < rules.minLength) {
    return { isValid: false, error: `${fieldName} must be at least ${rules.minLength} characters long` }
  }

  if (value.trim() && rules.maxLength && value.length > rules.maxLength) {
    return { isValid: false, error: `${fieldName} must not exceed ${rules.maxLength} characters` }
  }

  if (value.trim() && rules.pattern && !rules.pattern.test(value)) {
    return { isValid: false, error: getPatternErrorMessage(fieldName, rules.pattern) }
  }

  if (value.trim() && rules.custom && !rules.custom(value)) {
    return { isValid: false, error: `${fieldName} format is invalid` }
  }

  return { isValid: true }
}

// Get error message based on pattern
const getPatternErrorMessage = (fieldName: string, pattern: RegExp): string => {
  const patternStr = pattern.toString()
  
  if (patternStr.includes('[@]')) {
    return 'Please provide a valid email address'
  }
  
  if (patternStr.includes('[a-zA-Z\\s]')) {
    return `${fieldName} can only contain letters and spaces`
  }
  
  if (patternStr.includes('[\\d\\s-()]')) {
    return 'Please provide a valid phone number'
  }
  
  if (patternStr.includes('(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)')) {
    return 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
  }
  
  return `${fieldName} format is invalid`
}

// Email validation
export const validateEmail = (email: string): ValidationResult => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return validateField(email, {
    required: true,
    pattern: emailPattern
  }, 'Email')
}

// Password validation
export const validatePassword = (password: string): ValidationResult => {
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/
  return validateField(password, {
    required: true,
    minLength: 6,
    pattern: passwordPattern
  }, 'Password')
}

// Name validation
export const validateName = (name: string): ValidationResult => {
  const namePattern = /^[a-zA-Z\s]+$/
  return validateField(name, {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: namePattern
  }, 'Name')
}

// Phone number validation
export const validatePhoneNumber = (phoneNumber: string): ValidationResult => {
  if (!phoneNumber.trim()) {
    return { isValid: true } // Optional field
  }
  
  const phonePattern = /^\+?[\d\s-()]+$/
  return validateField(phoneNumber, {
    pattern: phonePattern
  }, 'Phone number')
}

// Confirm password validation
export const validateConfirmPassword = (password: string, confirmPassword: string): ValidationResult => {
  if (!confirmPassword.trim()) {
    return { isValid: false, error: 'Please confirm your password' }
  }
  
  if (password !== confirmPassword) {
    return { isValid: false, error: 'Passwords do not match' }
  }
  
  return { isValid: true }
}

// Form validation helper
export const validateForm = (formData: Record<string, string>, validationRules: Record<string, ValidationRules>): { isValid: boolean, errors: Record<string, string> } => {
  const errors: Record<string, string> = {}
  let isValid = true

  for (const [field, rules] of Object.entries(validationRules)) {
    const value = formData[field] || ''
    const result = validateField(value, rules, field)
    
    if (!result.isValid) {
      errors[field] = result.error || 'Invalid input'
      isValid = false
    }
  }

  return { isValid, errors }
}

// Real-time validation hook (for React components)
export const useFormValidation = (initialValues: Record<string, string>, validationRules: Record<string, ValidationRules>) => {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const validateField = (field: string, value: string) => {
    const rules = validationRules[field]
    if (!rules) return

    const result = validateField(value, rules, field)
    setErrors(prev => ({
      ...prev,
      [field]: result.isValid ? '' : result.error || 'Invalid input'
    }))
  }

  const handleChange = (field: string, value: string) => {
    setValues(prev => ({ ...prev, [field]: value }))
    
    // Validate only if field has been touched
    if (touched[field]) {
      validateField(field, value)
    }
  }

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }))
    validateField(field, values[field])
  }

  const validateAll = () => {
    const result = validateForm(values, validationRules)
    setErrors(result.errors)
    return result.isValid
  }

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    isValid: Object.keys(errors).length === 0 || Object.values(errors).every(error => !error)
  }
}

// Export validation constants for reuse
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\+?[\d\s-()]+$/,
  NAME: /^[a-zA-Z\s]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
  STRONG_PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
}

export const VALIDATION_MESSAGES = {
  REQUIRED: (field: string) => `${field} is required`,
  MIN_LENGTH: (field: string, length: number) => `${field} must be at least ${length} characters long`,
  MAX_LENGTH: (field: string, length: number) => `${field} must not exceed ${length} characters`,
  INVALID_EMAIL: 'Please provide a valid email address',
  INVALID_PHONE: 'Please provide a valid phone number',
  INVALID_NAME: 'Name can only contain letters and spaces',
  WEAK_PASSWORD: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  PASSWORDS_DONT_MATCH: 'Passwords do not match',
}