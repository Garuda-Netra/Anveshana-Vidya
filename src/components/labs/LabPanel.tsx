import { ReactNode, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
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
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Lock background body scroll
      document.body.style.overflow = 'hidden';

      // Pause Lenis smooth scrolling so background page never scrolls
      const lenisInstance = window.__lenis;
      if (lenisInstance) {
        lenisInstance.stop();
      }

      const timer = setTimeout(() => closeRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    } else {
      // Restore body scroll
      document.body.style.overflow = 'unset';

      // Resume Lenis smooth scrolling
      const lenisInstance = window.__lenis;
      if (lenisInstance) {
        lenisInstance.start();
      }
    }

    return () => {
      document.body.style.overflow = 'unset';
      const lenisInstance = window.__lenis;
      if (lenisInstance) {
        lenisInstance.start();
      }
    };
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md overflow-y-auto"
      data-lenis-prevent
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel ?? title}
      style={{
        overscrollBehavior: 'contain',
        WebkitOverflowScrolling: 'touch',
      }}
      onClick={onClose}
    >
      <div
        ref={panelRef}
        className="w-full max-w-4xl max-h-[90vh] bg-bg-darker rounded-2xl border border-accent-neon/40 shadow-neon-strong overflow-hidden animate-fade-in flex flex-col my-auto"
        data-lenis-prevent
        style={{
          overscrollBehavior: 'contain',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-glass bg-bg-darker/95 backdrop-blur-md sticky top-0 z-20 shrink-0">
          <div>
            <p className="text-accent-neon font-bold text-lg font-mono tracking-wide">{title}</p>
            {subtitle && <p className="text-text-tertiary text-xs font-sans mt-0.5">{subtitle}</p>}
          </div>
          <button
            ref={closeRef}
            onClick={onClose}
            className="text-text-tertiary hover:text-accent-neon transition-colors p-2 rounded-lg hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-accent-neon"
            aria-label="Close lab panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div
          className="p-6 bg-gradient-to-br from-bg-darker via-bg-dark to-bg-darker overflow-y-auto custom-scroll flex-1"
          data-lenis-prevent
          style={{
            overscrollBehavior: 'contain',
          }}
        >
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
