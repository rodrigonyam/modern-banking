import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';
import { BanknotesIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import type { LoginFormData, ValidationErrors } from '@/types/components';

interface DemoUser {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  
  const { login, loading, error: authError, clearError } = useAuth();
  const { showError, showSuccess } = useNotification();
  const navigate = useNavigate();

  // Clear validation errors when user starts typing
  useEffect(() => {
    if (Object.keys(validationErrors).length > 0) {
      setValidationErrors({});
    }
  }, [formData.username, formData.password]);

  // Clear auth errors when component unmounts or user starts typing
  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  useEffect(() => {
    if (formData.username || formData.password) {
      clearError();
    }
  }, [formData.username, formData.password, clearError]);

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    if (!formData.username.trim()) {
      errors.username = 'Email is required';
    } else if (!formData.username.includes('@') || !formData.username.includes('.')) {
      errors.username = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    clearError();

    try {
      const result = await login(formData.username.trim(), formData.password);
      
      if (result.success) {
        showSuccess('Successfully signed in! Welcome back.');
        navigate('/dashboard');
      } else {
        showError(result.error || 'Failed to sign in. Please try again.');
      }
    } catch (err) {
      console.error('Login submission error:', err);
      showError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof LoginFormData) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDemoLogin = (demoUser: DemoUser): void => {
    setFormData({
      username: demoUser.username,
      password: demoUser.password
    });
    setValidationErrors({});
    clearError();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <BanknotesIcon className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Welcome to SecureBank</h2>
          <p className="mt-2 text-sm text-gray-600">Sign in to your account</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            {authError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm">{authError}</p>
                  </div>
                  <div className="ml-auto">
                    <button
                      type="button"
                      onClick={clearError}
                      className="text-red-400 hover:text-red-600"
                    >
                      ×
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={formData.username}
                onChange={(e) => handleInputChange('username')(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  validationErrors.username 
                    ? 'border-red-300 focus:ring-red-500' 
                    : 'border-gray-300'
                }`}
                placeholder="demo@bank.com"
                disabled={loading || isSubmitting}
                aria-invalid={validationErrors.username ? 'true' : 'false'}
                aria-describedby={validationErrors.username ? 'username-error' : undefined}
                required
              />
              {validationErrors.username && (
                <p id="username-error" className="mt-1 text-sm text-red-600">
                  {validationErrors.username}
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password')(e.target.value)}
                  className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    validationErrors.password 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-gray-300'
                  }`}
                  placeholder="Enter your password"
                  disabled={loading || isSubmitting}
                  aria-invalid={validationErrors.password ? 'true' : 'false'}
                  aria-describedby={validationErrors.password ? 'password-error' : undefined}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  disabled={loading || isSubmitting}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {validationErrors.password && (
                <p id="password-error" className="mt-1 text-sm text-red-600">
                  {validationErrors.password}
                </p>
              )}
            </div>
            
            <button
              type="submit"
              disabled={loading || isSubmitting}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading || isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing In...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <div className="border-t border-gray-200 pt-6">
              <p className="text-xs text-gray-500 mb-4">
                Demo credentials - Click to auto-fill:
              </p>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => handleDemoLogin({ username: 'demo@bank.com', password: 'demo123' })}
                  className="block w-full text-xs text-blue-600 hover:text-blue-800 p-2 border border-gray-200 rounded hover:bg-blue-50"
                  disabled={loading || isSubmitting}
                >
                  Demo User: demo@bank.com / demo123
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin({ username: 'test@bank.com', password: 'test123' })}
                  className="block w-full text-xs text-blue-600 hover:text-blue-800 p-2 border border-gray-200 rounded hover:bg-blue-50"
                  disabled={loading || isSubmitting}
                >
                  Test User: test@bank.com / test123
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;