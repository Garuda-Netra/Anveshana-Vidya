import { clsx } from 'clsx';
import { motion } from 'framer-motion';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export default function SectionHeader({ 
  title, 
  subtitle, 
  align = 'left', 
  className 
}: SectionHeaderProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={clsx(
        'mb-12',
        {
          'text-left': align === 'left',
          'text-center': align === 'center',
          'text-right': align === 'right',
        },
        className
      )}
    >
      {/* Section label badge */}
      <motion.div
        initial={{ opacity: 0, x: align === 'right' ? 20 : -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className={clsx('mb-3', {
          'flex': align === 'left',
          'flex justify-center': align === 'center',
          'flex justify-end': align === 'right',
        })}
      >
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-accent-cyan/30 bg-accent-cyan/8 text-accent-cyan text-xs font-mono tracking-widest uppercase">
          <span className="w-1 h-1 rounded-full bg-accent-cyan animate-pulse" />
          {title.split(' ')[0]}
        </span>
      </motion.div>

      <div className={clsx(
        'flex items-center gap-4',
        {
          'justify-start': align === 'left',
          'justify-center': align === 'center',
          'justify-end': align === 'right',
        }
      )}>
        {/* Left accent bar for left-aligned */}
        {align === 'left' && (
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="w-1 h-10 rounded-full bg-gradient-to-b from-accent-cyan to-accent-purple origin-top flex-shrink-0"
            style={{ boxShadow: '0 0 8px rgba(0, 255, 255, 0.4)' }}
          />
        )}

        <div className={clsx('inline-block', {
          'mx-0': align === 'left',
          'mx-auto': align === 'center',
          'ml-auto': align === 'right',
        })}>
          <h2 className="text-3xl md:text-4xl font-bold mb-0 py-2 px-0 whitespace-nowrap text-text-primary">
            {title}
          </h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ delay: 0.35, duration: 0.55 }}
            className="w-full h-[2px] bg-gradient-to-r from-accent-cyan via-accent-neon to-accent-purple origin-left"
            style={{ marginTop: '4px', boxShadow: '0 0 10px rgba(0, 255, 255, 0.5), 0 0 20px rgba(168, 85, 247, 0.3)' }}
          />
        </div>
      </div>

      {subtitle && (
        <p className="text-lg text-text-secondary max-w-3xl leading-relaxed mt-6">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

