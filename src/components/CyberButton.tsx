import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, ReactNode } from 'react';

interface CyberButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
}

export default function CyberButton({
  children,
  className,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled,
  ...props
}: CyberButtonProps) {
  const variants = {
    primary: 'bg-emerald-500 text-black hover:bg-emerald-400 font-bold',
    secondary: 'bg-white text-black hover:bg-white/90 font-bold',
    ghost: 'bg-white/5 text-white hover:bg-white/10 border border-white/5',
    outline: 'bg-transparent text-white border border-white/20 hover:border-white/40'
  };

  const sizes = {
    sm: 'px-3 py-2 text-xs rounded-xl',
    md: 'px-5 py-3 text-xs rounded-2xl',
    lg: 'px-8 py-4 text-sm rounded-2xl'
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 uppercase tracking-widest transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {icon && iconPosition === 'left' && icon}
          {children}
          {icon && iconPosition === 'right' && icon}
        </>
      )}
    </button>
  );
}
