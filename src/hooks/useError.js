import { useState, useCallback } from 'react';

/**
 * Custom hook for handling errors with automatic clearing
 */
export const useError = () => {
  const [error, setError] = useState(null);
  const [isError, setIsError] = useState(false);

  const showError = useCallback((errorMessage, duration = 5000) => {
    setError(errorMessage);
    setIsError(true);

    // Auto-clear error after duration
    if (duration > 0) {
      setTimeout(() => {
        clearError();
      }, duration);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
    setIsError(false);
  }, []);

  const handleError = useCallback((error) => {
    console.error('Error handled by useError:', error);
    
    let errorMessage = 'An unexpected error occurred';
    
    if (typeof error === 'string') {
      errorMessage = error;
    } else if (error?.message) {
      errorMessage = error.message;
    } else if (error?.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error?.response?.statusText) {
      errorMessage = error.response.statusText;
    }

    showError(errorMessage);
  }, [showError]);

  return {
    error,
    isError,
    showError,
    clearError,
    handleError
  };
};