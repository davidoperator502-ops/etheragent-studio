import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import IntelligenceEngine from '../components/dashboard/IntelligenceEngine';
import { api } from '../services/api';

// El componente fue rediseñado a "EtherClaw — Neural Casting Studio":
// genera un avatar con api.generateAvatarImage(prompt) y avanza por fases
// (input → generating → image-ready → paywall …). Estos tests reflejan ese flujo real.
vi.mock('../services/api', () => ({
  api: { generateAvatarImage: vi.fn() },
  ApiError: class ApiError extends Error {},
}));

describe('IntelligenceEngine (EtherClaw Neural Casting Studio)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza la fase input con textarea de prompt y botón Generar', () => {
    render(<IntelligenceEngine />);
    expect(screen.getByText('EtherClaw')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Describe tu avatar/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Generar/i })).toBeInTheDocument();
  });

  it('deshabilita Generar cuando el prompt está vacío', () => {
    render(<IntelligenceEngine />);
    expect(screen.getByRole('button', { name: /Generar/i })).toBeDisabled();
  });

  it('actualiza el prompt al escribir', () => {
    render(<IntelligenceEngine />);
    const input = screen.getByPlaceholderText(/Describe tu avatar/i);
    fireEvent.change(input, { target: { value: 'Doctora premium en Miami' } });
    expect(input).toHaveValue('Doctora premium en Miami');
  });

  it('rellena el prompt desde una tarjeta de ejemplo', () => {
    render(<IntelligenceEngine />);
    fireEvent.click(screen.getByText('Médico boutique en Madrid'));
    expect(screen.getByPlaceholderText(/Describe tu avatar/i)).toHaveValue('Médico boutique en Madrid');
  });

  it('no llama a la API cuando el prompt está vacío', () => {
    render(<IntelligenceEngine />);
    fireEvent.click(screen.getByRole('button', { name: /Generar/i }));
    expect(api.generateAvatarImage).not.toHaveBeenCalled();
  });

  it('llama a generateAvatarImage al pulsar Generar con un prompt', async () => {
    vi.mocked(api.generateAvatarImage).mockResolvedValue({ imageUrl: 'http://x/img.png', seed: 42 });
    render(<IntelligenceEngine />);
    fireEvent.change(screen.getByPlaceholderText(/Describe tu avatar/i), { target: { value: 'Abogado corporativo' } });
    fireEvent.click(screen.getByRole('button', { name: /Generar/i }));
    await waitFor(() => expect(api.generateAvatarImage).toHaveBeenCalledWith('Abogado corporativo'));
  });

  it('muestra el estado image-ready tras una generación exitosa', async () => {
    vi.mocked(api.generateAvatarImage).mockResolvedValue({ imageUrl: 'http://x/img.png', seed: 42 });
    render(<IntelligenceEngine />);
    fireEvent.change(screen.getByPlaceholderText(/Describe tu avatar/i), { target: { value: 'Tienda de sneakers' } });
    fireEvent.click(screen.getByRole('button', { name: /Generar/i }));
    await waitFor(() => expect(screen.getByText('Imagen Generada')).toBeInTheDocument());
  });
});
