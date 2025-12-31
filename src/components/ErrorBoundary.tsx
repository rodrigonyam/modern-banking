import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Log error to external service in production
    if (process.env.NODE_ENV === 'production') {
      console.error('Error caught by boundary:', error, errorInfo);
      // TODO: Send to logging service (e.g., Sentry, LogRocket)
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50" role="alert">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
            <div className="flex justify-center mb-4" aria-hidden="true">
              <ExclamationTriangleIcon className="h-12 w-12 text-red-500" />
            </div>
            <h1 
              className="text-2xl font-bold text-gray-900 mb-4"
              id="error-heading"
              aria-label="Error occurred"
            >
              Something went wrong
            </h1>
            <p 
              className="text-gray-600 mb-6"
              aria-describedby="error-heading"
            >
              We apologize for the inconvenience. The application has encountered an error.
            </p>
            
            {process.env.NODE_ENV === 'development' && (
              <details className="text-left bg-gray-50 p-4 rounded mb-6">
                <summary 
                  className="cursor-pointer font-medium text-red-600 mb-2"
                  aria-label="Show error details for debugging"
                >
                  Error Details (Development Only)
                </summary>
                <div className="text-sm text-gray-700 space-y-2">
                  <div>
                    <strong>Error:</strong>
                    <div className="mt-1">{this.state.error && this.state.error.toString()}</div>
                  </div>
                  <div>
                    <strong>Component Stack:</strong>
                    <pre 
                      className="mt-1 text-xs whitespace-pre-wrap"
                      aria-label="Component stack trace"
                    >
                      {this.state.errorInfo?.componentStack || 'No component stack available'}
                    </pre>
                  </div>
                </div>
              </details>
            )}
            
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                aria-label="Refresh the current page to try again"
              >
                Refresh Page
              </button>
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null, errorInfo: null });
                  window.location.href = '/';
                }}
                className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
                aria-label="Navigate to home page"
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;