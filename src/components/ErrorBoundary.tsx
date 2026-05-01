import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-surface p-4">
          <div className="text-center max-w-md">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-error-container rounded-full mb-4">
              <AlertTriangle className="w-8 h-8 text-error" />
            </div>
            <h2 className="font-headline text-xl font-bold text-on-surface mb-2">
              Algo salió mal
            </h2>
            <p className="text-on-surface-variant text-sm mb-6">
              Ha ocurrido un error inesperado. Por favor intenta recargar la página.
            </p>
            <button
              onClick={this.handleRetry}
              className="inline-flex items-center gap-2 bg-[#202983] hover:bg-[#39429b] text-white font-medium py-2.5 px-5 rounded-xl transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Reintentar
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
