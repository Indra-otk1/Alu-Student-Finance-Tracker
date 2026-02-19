// validators.js - Input validation with regex patterns

// Regex patterns
const PATTERNS = {
  description: /^\S(?:.*\S)?$/, // No leading/trailing spaces, collapse doubles
  amount: /^(0|[1-9]\d*)(\.\d{1,2})?$/, // Numeric with up to 2 decimals
  date: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/, // YYYY-MM-DD
  category: /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/, // Letters, spaces, hyphens
  duplicateWords: /\b(\w+)\s+\1\b/ // Duplicate words (advanced)
};

export { PATTERNS };

export const validateDescription = (value) => {
  const errors = [];
  const trimmed = value.trim();
  
  // Check for leading/trailing spaces
  if (value !== trimmed) {
    errors.push('No leading or trailing spaces allowed');
  }
  
  // Check for duplicate words (advanced regex)
  if (PATTERNS.duplicateWords.test(trimmed)) {
    errors.push('Duplicate words detected (e.g., "money money")');
  }
  
  // Check format
  if (!PATTERNS.description.test(trimmed)) {
    errors.push('Description must be non-empty and valid format');
  }
  
  return errors;
};

export const validateAmount = (value) => {
  const errors = [];
  
  if (!PATTERNS.amount.test(value)) {
    errors.push('Amount must be a valid number (0-9, max 2 decimals)');
  }
  
  const num = parseFloat(value);
  if (num < 0) {
    errors.push('Amount cannot be negative');
  }
  
  return errors;
};

export const validateDate = (value) => {
  const errors = [];
  
  if (!PATTERNS.date.test(value)) {
    errors.push('Date must be in YYYY-MM-DD format');
  }
  
  const date = new Date(value + 'T00:00:00');
  if (isNaN(date.getTime())) {
    errors.push('Invalid date');
  }
  
  // Check if date is not in the future (optional)
  if (date > new Date()) {
    errors.push('Date cannot be in the future');
  }
  
  return errors;
};

export const validateCategory = (value) => {
  const errors = [];
  const trimmed = value.trim();
  
  if (!PATTERNS.category.test(trimmed)) {
    errors.push('Category must contain only letters, spaces, and hyphens');
  }
  
  if (trimmed.length === 0) {
    errors.push('Category cannot be empty');
  }
  
  return errors;
};

export const validateAll = (record) => {
  const allErrors = {};
  
  const descErrors = validateDescription(record.description);
  if (descErrors.length) allErrors.description = descErrors;
  
  const amountErrors = validateAmount(String(record.amount));
  if (amountErrors.length) allErrors.amount = amountErrors;
  
  const dateErrors = validateDate(record.date);
  if (dateErrors.length) allErrors.date = dateErrors;
  
  const catErrors = validateCategory(record.category);
  if (catErrors.length) allErrors.category = catErrors;
  
  return Object.keys(allErrors).length === 0 ? null : allErrors;
};

export const isValidId = (id) => /^rec_\d+$/.test(id);
