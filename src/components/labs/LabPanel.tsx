import { ReactNode, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export interface LabPanelProps {
  title: string;
  subtitle?: string;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  ariaLabel?: string;
}

export function LabPanel({ title, subtitle, isOpen, onClose, children, ariaLabel }: LabPanelProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => closeRef.current?.focus(), 0);
      return () => clearTimeout(timer);
    }
    return () => undefined;
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[120] flex items-start justify-center bg-black/60 backdrop-blur-md overflow-y-auto"
      style={{ paddingTop: '80px' }}
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel ?? title}
    >
      <div className="w-full max-w-4xl mx-4 md:mx-8 mb-8 bg-bg-darker rounded-2xl border border-accent-neon/40 shadow-neon overflow-hidden animate-fade-in flex flex-col">
        {/* Sticky header – always visible even when content is long */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-glass bg-bg-dark/90 sticky top-0 z-10">
          <div>
            <p className="text-accent-neon font-bold text-lg">{title}</p>
            {subtitle && <p className="text-text-tertiary text-sm">{subtitle}</p>}
          </div>
          <button
            ref={closeRef}
            onClick={onClose}
            className="text-text-tertiary hover:text-accent-neon transition-colors p-1 rounded hover:bg-white/5"
            aria-label="Close lab panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 bg-gradient-to-br from-bg-darker to-bg-dark">
          {children}
        </div>
      </div>
    </div>
  );
}
