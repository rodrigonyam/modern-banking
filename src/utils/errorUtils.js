/**
 * Error handling utilities
 */

export const ErrorTypes = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  PERMISSION_ERROR: 'PERMISSION_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  CLIENT_ERROR: 'CLIENT_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
};

export class AppError extends Error {
  constructor(message, type = ErrorTypes.UNKNOWN_ERROR, originalError = null) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.originalError = originalError;
    this.timestamp = new Date().toISOString();
  }
}

/**
 * Standardize error messages for different error types
 */
export const getErrorMessage = (error) => {
  if (typeof error === 'string') {
    return error;
  }

  if (error instanceof AppError) {
    return error.message;
  }

  if (error?.response) {
    // HTTP errors
    const status = error.response.status;
    const message = error.response.data?.message || error.response.statusText;

    switch (status) {
      case 400:
        return message || 'Invalid request. Please check your input.';
      case 401:
        return 'You are not authenticated. Please log in again.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 429:
        return 'Too many requests. Please try again later.';
      case 500:
        return 'Server error. Please try again later.';
      case 503:
        return 'Service temporarily unavailable. Please try again later.';
      default:
        return message || `An error occurred (${status})`;
    }
  }

  if (error?.code === 'NETWORK_ERROR' || error?.message?.includes('Network Error')) {
    return 'Network connection error. Please check your internet connection.';
  }

  if (error?.name === 'ValidationError') {
    return error.message || 'Please check your input and try again.';
  }

  return error?.message || 'An unexpected error occurred. Please try again.';
};

/**
 * Log errors to console and external services
 */
export const logError = (error, context = {}) => {
  const errorInfo = {
    message: error?.message || 'Unknown error',
    stack: error?.stack,
    type: error?.type || ErrorTypes.UNKNOWN_ERROR,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href,
    context
  };

  // Always log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.group('🚨 Error Log');
    console.error('Error:', error);
    console.log('Context:', context);
    console.log('Error Info:', errorInfo);
    console.groupEnd();
  }

  // In production, send to logging service
  if (process.env.NODE_ENV === 'production') {
    try {
      // TODO: Send to external logging service (Sentry, LogRocket, etc.)
      // Example: Sentry.captureException(error, { extra: errorInfo });
      console.error('Error logged:', errorInfo);
    } catch (loggingError) {
      console.error('Failed to log error:', loggingError);
    }
  }
};

/**
 * Retry function with exponential backoff
 */
export const retryWithBackoff = async (
  fn,
  maxRetries = 3,
  baseDelay = 1000,
  backoffFactor = 2
) => {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxRetries) {
        break;
      }

      const delay = baseDelay * Math.pow(backoffFactor, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
};

/**
 * Debounce function for error handling
 */
export const debounce = (func, wait) => {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Create a safe async function that catches and handles errors
 */
export const safeAsync = (asyncFn, errorHandler) => {
  return async (...args) => {
    try {
      return await asyncFn(...args);
    } catch (error) {
      if (errorHandler) {
        errorHandler(error);
      } else {
        logError(error, { function: asyncFn.name, args });
      }
      throw error;
    }
  };
};