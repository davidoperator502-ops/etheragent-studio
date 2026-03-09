import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  active?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export default function GlassCard({
  children,
  className,
  hover = false,
  active = false,
  padding = 'md'
}: GlassCardProps) {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  return (
    <div
      className={cn(
        'glass-panel rounded-[24px] transition-all duration-300',
        paddingClasses[padding],
        hover && 'hover:bg-white/5 hover:border-white/15 cursor-pointer',
        active && 'border-emerald-500/30 shadow-[0_8px_30px_rgba(0,0,0,0.5)]',
        className
      )}
    >
      {children}
    </div>
  );
}
