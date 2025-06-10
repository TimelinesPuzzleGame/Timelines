import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error | null; resetError: () => void }>;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  resetError = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
      }

      // Default fallback UI
      return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Oops! Something went wrong</h1>
            <p className="text-gray-700 mb-4">
              We encountered an error while running the game. This might be due to a temporary issue.
            </p>
            <details className="mb-4 text-sm text-gray-600">
              <summary className="cursor-pointer font-semibold">Error details</summary>
              <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto">
                {this.state.error?.toString()}
              </pre>
            </details>
            <div className="flex gap-4">
              <button
                onClick={this.resetError}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Party Mode specific error boundary
export const PartyModeErrorFallback: React.FC<{ error: Error | null; resetError: () => void }> = ({ error, resetError }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-10 flex flex-col items-center justify-center text-center">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-2xl w-full">
        <h1 className="text-4xl font-bold mb-4 text-red-600">
          🎮 Game Error! 🎮
        </h1>
        
        <p className="text-xl text-gray-700 mb-6">
          Sorry, we hit a snag during your party game!
        </p>

        <details className="mb-6 text-left">
          <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
            Show error details
          </summary>
          <pre className="mt-2 p-4 bg-gray-100 rounded text-sm overflow-auto">
            {error?.toString()}
          </pre>
        </details>

        <div className="flex gap-4 justify-center">
          <button
            className="px-8 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 hover:shadow-lg hover:scale-105 transition-all"
            onClick={() => {
              resetError();
              window.location.reload();
            }}
          >
            🔄 Restart Game
          </button>
          
          <button
            className="px-8 py-3 bg-gray-500 text-white font-bold rounded-lg hover:bg-gray-600 hover:shadow-lg hover:scale-105 transition-all"
            onClick={() => window.location.href = '/'}
          >
            🏠 Main Menu
          </button>
        </div>
      </div>
    </div>
  );
}; 