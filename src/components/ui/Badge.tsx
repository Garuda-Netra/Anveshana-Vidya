import { ReactNode } from 'react';
import { clsx } from 'clsx';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'outline' | 'neon' | 'warning' | 'success';
  className?: string;
}

export default function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    default: 'bg-surface-glass text-text-secondary border border-border-glass backdrop-blur-sm',
    outline: 'bg-transparent text-text-primary border border-text-secondary/40 hover:border-text-secondary',
    neon: 'bg-accent-neon/10 text-accent-neon border border-accent-neon/40 shadow-[0_0_8px_rgba(0,255,255,0.2)]',
    warning: 'bg-accent-warning/10 text-accent-warning border border-accent-warning/40 shadow-[0_0_8px_rgba(245,158,11,0.2)]',
    success: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/40 shadow-[0_0_8px_rgba(16,185,129,0.2)]',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
