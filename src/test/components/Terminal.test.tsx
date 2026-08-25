import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Terminal from '../../components/features/Terminal';

// Mock scrollIntoView
window.HTMLElement.prototype.scrollIntoView = vi.fn();

describe('Terminal Component', () => {
  it('renders initial welcome message and quick chips', () => {
    render(<Terminal />);
    expect(screen.getByText(/FORENSEC COMMAND CENTER/i)).toBeInTheDocument();
    expect(screen.getByText(/User Guide/i)).toBeInTheDocument();
  });

  it('accepts help command and displays instant forensic arsenal', () => {
    render(<Terminal />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'help' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    // Registry is now loaded instantly without delay
    expect(screen.getByText(/FORENSEC COMMAND ARSENAL/i)).toBeInTheDocument();
  });

  it('clears history on clear command', () => {
    render(<Terminal />);
    const input = screen.getByRole('textbox');
    
    // Add some history
    fireEvent.change(input, { target: { value: 'help' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    expect(screen.getByText(/FORENSEC COMMAND ARSENAL/i)).toBeInTheDocument();
    
    // Clear
    fireEvent.change(input, { target: { value: 'clear' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(screen.queryByText(/FORENSEC COMMAND ARSENAL/i)).not.toBeInTheDocument();
  });

  it('executes standard CLI commands like whoami and sysinfo', () => {
    render(<Terminal />);
    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: 'whoami' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(screen.getByText(/Forensic Investigator Clearance/i)).toBeInTheDocument();
  });
});
