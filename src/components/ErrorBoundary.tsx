import { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, Navigate } from 'react-router-dom';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorFallback 
          error={this.state.error} 
          onReset={this.handleReset} 
        />
      );
    }

    return this.props.children;
  }
}

const ErrorFallback = ({ error, onReset }: { error?: Error; onReset: () => void }) => {
  return (
    <div className="min-h-[50vh] flex items-center justify-center p-8">
      <div className="glass-panel max-w-md w-full p-8 rounded-[24px] text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/10 flex items-center justify-center">
          <AlertTriangle className="text-red-400" size={32} />
        </div>
        
        <h2 className="text-xl font-bold text-white mb-2">
          Algo salió mal
        </h2>
        <p className="text-white/50 text-sm mb-6">
          {error?.message || 'Error inesperado en el componente'}
        </p>

        <div className="flex gap-3 justify-center">
          <Button
            onClick={onReset}
            variant="outline"
            className="glass-panel border-white/10 text-white hover:bg-white/5"
          >
            <RefreshCw size={16} className="mr-2" />
            Reintentar
          </Button>
          <ErrorBoundaryNavigate />
        </div>
      </div>
    </div>
  );
};

const ErrorBoundaryNavigate = () => {
  const navigate = useNavigate();
  return (
    <Button
      onClick={() => navigate('/')}
      className="bg-emerald-500 hover:bg-emerald-600 text-black"
    >
      <Home size={16} className="mr-2" />
      Inicio
    </Button>
  );
};

export default ErrorBoundary;
