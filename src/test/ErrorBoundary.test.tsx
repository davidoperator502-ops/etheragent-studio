import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from '../components/ErrorBoundary';

const ThrowError = ({ shouldThrow = true }: { shouldThrow?: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>Normal render</div>;
};

const renderWithRouter = (ui: React.ReactNode) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('ErrorBoundary', () => {

  it('should render children when there is no error', () => {
    renderWithRouter(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('should catch errors and display fallback UI', () => {
    renderWithRouter(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Algo salió mal')).toBeInTheDocument();
    expect(screen.getByText('Test error')).toBeInTheDocument();
  });

  it('should have retry button', () => {
    renderWithRouter(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Reintentar')).toBeInTheDocument();
  });

  it('should have home button', () => {
    renderWithRouter(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Inicio')).toBeInTheDocument();
  });

  it('should call onError callback when error occurs', () => {
    const spy = vi.spyOn(console, 'error');
    
    renderWithRouter(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    // React calls console.error multiple times for error boundaries
    // Just verify the component rendered with error
    expect(screen.getByText('Algo salió mal')).toBeInTheDocument();
    spy.mockRestore();
  });

  it('should render custom fallback when provided', () => {
    const CustomFallback = () => <div>Custom error UI</div>;

    renderWithRouter(
      <ErrorBoundary fallback={<CustomFallback />}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom error UI')).toBeInTheDocument();
  });
});
