import { ReactNode } from 'react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';
import GlassPanel from './GlassPanel';

interface CardProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  footer?: ReactNode;
  hoverEffect?: boolean;
  onClick?: () => void;
}

export default function Card({ 
  title, 
  subtitle, 
  children, 
  className, 
  footer,
  hoverEffect = true,
  onClick
}: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className={clsx('relative group corner-accents', className, onClick && 'cursor-pointer')}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      } : undefined}
    >
      {/* Gradient border that appears on hover */}
      <div className="absolute -inset-px rounded-lg bg-gradient-to-br from-accent-cyan/40 via-accent-purple/30 to-accent-neon/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      
      <GlassPanel 
        className="flex flex-col h-full overflow-hidden glass-shine"
        hoverEffect={hoverEffect}
      >
        {(title || subtitle) && (
          <div className="p-6 border-b border-border-glass relative overflow-hidden">
            {/* Subtle header gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-accent-cyan/5 to-transparent pointer-events-none" />
            <div className="relative z-10">
              {title && (
                <h3 className="text-xl font-bold text-text-primary group-hover:text-gradient-cyan transition-all duration-300">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="mt-1 text-xs text-accent-neon/70 font-mono tracking-wide uppercase">{subtitle}</p>
              )}
            </div>
          </div>
        )}
        
        <div className="flex-1 p-6">
          {children}
        </div>
        
        {footer && (
          <div className="p-4 bg-surface-glass border-t border-border-glass">
            {footer}
          </div>
        )}
      </GlassPanel>
    </motion.div>
  );
}
