import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import IntelligenceEngine from '../components/dashboard/IntelligenceEngine';
import { api, AnalysisData } from '../services/api';

vi.mock('../services/api', () => ({
  api: {
    analyzeUrl: vi.fn(),
  },
}));

const mockAnalysisData: AnalysisData = {
  targetAudience: {
    description: 'SaaS founders aged 28-45 seeking automation.',
    tags: ['B2B', 'Decision Makers', 'Tech-Savvy'],
  },
  financialProjection: {
    description: 'LTV of $12,400 with 13.9x ROI.',
    tags: ['High Margin', 'Recurring Revenue'],
  },
  executiveDirective: {
    description: 'Position as workflow orchestration leader.',
    tags: ['Thought Leadership', 'Differentiation'],
  },
  strategicHook: 'What if your team could recover 15 hours per week?',
};

describe('IntelligenceEngine', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the component with title and input', () => {
    render(<IntelligenceEngine />);

    expect(screen.getByText('Intelligence Engine')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('enter-your-client-saas.com')).toBeInTheDocument();
    expect(screen.getByText('Deploy OS')).toBeInTheDocument();
  });

  it('should have Autonomous Strategy API badge', () => {
    render(<IntelligenceEngine />);

    expect(screen.getByText('Autonomous Strategy API')).toBeInTheDocument();
  });

  it('should update URL state when input changes', () => {
    render(<IntelligenceEngine />);
    
    const input = screen.getByPlaceholderText('enter-your-client-saas.com');
    fireEvent.change(input, { target: { value: 'https://test-saas.com' } });

    expect(input).toHaveValue('https://test-saas.com');
  });

  it('should call analyzeUrl when button is clicked', async () => {
    vi.mocked(api.analyzeUrl).mockResolvedValue(mockAnalysisData);

    render(<IntelligenceEngine />);
    
    const input = screen.getByPlaceholderText('enter-your-client-saas.com');
    fireEvent.change(input, { target: { value: 'https://test-saas.com' } });

    const button = screen.getByText('Deploy OS');
    fireEvent.click(button);

    await waitFor(() => {
      expect(api.analyzeUrl).toHaveBeenCalledWith('https://test-saas.com');
    });
  });

  it('should show loading state when analyzing', async () => {
    vi.mocked(api.analyzeUrl).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(mockAnalysisData), 100))
    );

    render(<IntelligenceEngine />);
    
    const input = screen.getByPlaceholderText('enter-your-client-saas.com');
    fireEvent.change(input, { target: { value: 'https://test-saas.com' } });

    const button = screen.getByText('Deploy OS');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Extrayendo...')).toBeInTheDocument();
    });
  });

  it('should display analysis results after successful API call', async () => {
    vi.mocked(api.analyzeUrl).mockResolvedValue(mockAnalysisData);

    render(<IntelligenceEngine />);
    
    const input = screen.getByPlaceholderText('enter-your-client-saas.com');
    fireEvent.change(input, { target: { value: 'https://test-saas.com' } });

    const button = screen.getByText('Deploy OS');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Core Audience')).toBeInTheDocument();
      expect(screen.getByText('Financial Projection')).toBeInTheDocument();
      expect(screen.getByText('Executive Directive')).toBeInTheDocument();
      expect(screen.getByText(/Strategic Hook/)).toBeInTheDocument();
    });
  });

  it('should disable button when URL is empty', () => {
    render(<IntelligenceEngine />);

    const button = screen.getByText('Deploy OS');
    expect(button).toBeDisabled();
  });

  it('should not call API when URL is empty', () => {
    render(<IntelligenceEngine />);

    const button = screen.getByText('Deploy OS');
    fireEvent.click(button);

    expect(api.analyzeUrl).not.toHaveBeenCalled();
  });

  it('should trigger analysis on Enter key press', async () => {
    vi.mocked(api.analyzeUrl).mockResolvedValue(mockAnalysisData);

    render(<IntelligenceEngine />);
    
    const input = screen.getByPlaceholderText('enter-your-client-saas.com');
    fireEvent.change(input, { target: { value: 'https://test-saas.com' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    await waitFor(() => {
      expect(api.analyzeUrl).toHaveBeenCalledWith('https://test-saas.com');
    });
  });
});
