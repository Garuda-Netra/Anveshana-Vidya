import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Terminal from '../../components/features/Terminal';

// Mock scrollIntoView
window.HTMLElement.prototype.scrollIntoView = vi.fn();

describe('Terminal Component', () => {
  it('renders initial welcome message', () => {
    render(<Terminal />);
    expect(screen.getByText(/FORENSEC COMMAND CENTER/i)).toBeInTheDocument();
  });

  it('accepts input and displays output', () => {
    render(<Terminal />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'help' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    // Registry hydration is async; the immediate response should be loading info.
    expect(screen.getByText(/Command registry loading/i)).toBeInTheDocument();
  });

  it('clears history on clear command', () => {
    render(<Terminal />);
    const input = screen.getByRole('textbox');
    
    // Add some history
    fireEvent.change(input, { target: { value: 'help' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    expect(screen.getByText(/Command registry loading/i)).toBeInTheDocument();
    
    // Clear
    fireEvent.change(input, { target: { value: 'clear' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(screen.queryByText(/Command registry loading/i)).not.toBeInTheDocument();
  });
});
