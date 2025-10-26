import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('React Error Boundary caught:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center p-8">
          <div className="max-w-2xl w-full bg-red-900/20 border border-red-500 rounded-2xl p-8">
            <h1 className="text-3xl font-bold text-red-400 mb-4">
              💥 Oops! Something crashed
            </h1>
            <p className="text-red-300 mb-4">
              The app encountered an error. Check the browser console for details.
            </p>
            {this.state.error && (
              <div className="bg-gray-900 rounded-lg p-4 mb-4">
                <p className="text-xs font-mono text-red-300">
                  {this.state.error.toString()}
                </p>
              </div>
            )}
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
