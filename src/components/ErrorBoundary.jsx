/**
 * ErrorBoundary component - Catches React errors gracefully
 * Displays user-friendly fallback UI when errors occur
 */
import { Component } from 'react';
import PropTypes from 'prop-types';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(caughtError, errorInfo) {
    // Log error for debugging
    console.error('ErrorBoundary caught an error:', caughtError);
    console.error('Error Info:', errorInfo);

    // Update state with error details
    this.setState({
      error: caughtError,
      errorInfo,
    });
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900 border-2 border-red-600 rounded-lg p-6">
            {/* Error Icon */}
            <div className="text-center mb-4">
              <div className="text-6xl mb-2">⚠️</div>
              <h1 className="text-2xl font-bold text-red-400">Something Went Wrong</h1>
            </div>

            {/* Error Message */}
            <p className="text-slate-300 text-center mb-4">
              The application encountered an unexpected error. Try refreshing the page or clearing
              your data.
            </p>

            {/* Debug Info (only in development) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-4 p-3 bg-slate-800 rounded text-xs text-slate-400 max-h-48 overflow-auto">
                <summary className="cursor-pointer font-semibold text-slate-300 mb-2">
                  Error Details (Dev Only)
                </summary>
                <p className="font-mono mb-2">{this.state.error.toString()}</p>
                {this.state.errorInfo && (
                  <pre className="font-mono text-xs overflow-x-auto">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </details>
            )}

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                onClick={this.resetError}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg
                           transition-colors font-semibold"
              >
                Try Again
              </button>
              <button
                onClick={() => (window.location.href = '/Tracker/')}
                className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-100 rounded-lg
                           transition-colors font-semibold"
              >
                Go to Home
              </button>
              <button
                onClick={() => {
                  if (window.confirm('Clear all data and refresh?')) {
                    localStorage.clear();
                    window.location.reload();
                  }
                }}
                className="w-full px-4 py-2 bg-red-900 hover:bg-red-800 text-red-100 rounded-lg
                           transition-colors font-semibold text-sm"
              >
                Clear Data & Refresh
              </button>
            </div>

            {/* Help Text */}
            <p className="text-xs text-slate-500 text-center mt-4">
              If the problem persists, please check the browser console for more details.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
